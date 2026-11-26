import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import MinimalHeader from '../components/layout/MinimalHeader.jsx'
import TextField from '../components/form/TextField.jsx'
import SelectField from '../components/form/SelectField.jsx'
import OptionCards from '../components/form/OptionCards.jsx'
import Button from '../components/ui/Button.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getProfile } from '../api/auth.js'
import { placeOrder } from '../api/orders.js'
import { assetUrl } from '../api/client.js'
import { formatPrice } from '../utils/format.js'
import { colorName } from '../utils/colors.js'
import { rules, formatCardNumber, formatExpiry } from '../utils/validation.js'
import { CARRIERS, CITIES, DELIVERY_METHODS, getDeliveryPoints } from '../data/delivery.js'
import styles from './CheckoutPage.module.css'

const PAYMENT_OPTIONS = [
  { value: 'CARD_ONLINE', label: 'Card online', hint: 'Visa, Mastercard, Apple Pay, Google Pay', icon: 'credit_card' },
  { value: 'PAY_ON_DELIVERY', label: 'Pay on delivery', hint: 'Cash or card when you collect', icon: 'package_2' },
]

const EMPTY_FORM = {
  email: '', phone: '', carrier: '', city: 'Kyiv', deliveryMethod: '', deliveryPoint: '',
  street: '', apartment: '', recipientName: '', paymentMethod: 'CARD_ONLINE',
  cardNumber: '', cardExpiry: '', cardCvc: '', discountCode: '',
}

// Перевірка всієї форми. Повертає об'єкт { назваПоля: 'текст помилки' } лише для полів з помилками.
function validate(form) {
  const errors = {
    email: rules.required('your email')(form.email) || rules.email(form.email),
    phone: rules.required('your phone number')(form.phone) || rules.phone(form.phone),
    carrier: form.carrier ? '' : 'Please select a carrier.',
  }
  if (form.carrier) {
    errors.city = form.city ? '' : 'Please select a city.'
    errors.deliveryMethod = form.deliveryMethod ? '' : 'Please select a delivery method.'
    if (form.deliveryMethod === 'COURIER') errors.street = rules.required('street and house')(form.street)
    else if (form.deliveryMethod) errors.deliveryPoint = form.deliveryPoint ? '' : 'Please select a delivery point.'
    errors.recipientName = rules.required('the recipient full name')(form.recipientName) || rules.fullName(form.recipientName)
  }
  if (form.paymentMethod === 'CARD_ONLINE') {
    errors.cardNumber = rules.cardNumber(form.cardNumber)
    errors.cardExpiry = rules.cardExpiry(form.cardExpiry)
    errors.cardCvc = rules.cvc(form.cardCvc)
  }
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

// Порядок полів на сторінці — щоб перевести фокус на ПЕРШЕ поле з помилкою
const FIELD_ORDER = ['email', 'phone', 'carrier', 'city', 'deliveryMethod', 'deliveryPoint', 'street', 'recipientName', 'cardNumber', 'cardExpiry', 'cardCvc']

export default function CheckoutPage() {
  const { cart, refreshCart, openCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const formRef = useRef(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})          // поля, з яких користувач уже пішов (blur)
  const [submitted, setSubmitted] = useState(false)   // чи була спроба відправити форму
  const [status, setStatus] = useState('idle')         // idle | sending | failed
  const [serverError, setServerError] = useState('')
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)
  const { isLoggedIn } = useAuth()

  // Користувач увійшов — заповнюємо форму з профілю та збережених "Delivery preferences" (як обіцяє макет кабінету)
  useEffect(() => {
    if (!isLoggedIn) return
    getProfile().then((p) => setForm((prev) => ({
      ...prev,
      email: prev.email || p.email || '',
      phone: prev.phone || p.phone || '',
      recipientName: prev.recipientName || [p.firstName, p.lastName].filter(Boolean).join(' '),
      carrier: prev.carrier || p.preferredCarrier || '',
      city: p.preferredCity || prev.city,
      deliveryMethod: prev.deliveryMethod || p.preferredDeliveryMethod || '',
      deliveryPoint: prev.deliveryPoint || p.preferredDeliveryPoint || '',
    }))).catch(() => {})
  }, [isLoggedIn])

  const items = cart?.items ?? []
  const methods = DELIVERY_METHODS[form.carrier] ?? []
  const method = methods.find((m) => m.value === form.deliveryMethod)
  const points = getDeliveryPoints(form.carrier, form.city, form.deliveryMethod)
  const shipping = method ? method.cost : null
  const subtotal = Number(cart?.subtotal ?? 0)
  const total = subtotal + (shipping ?? 0)
  // Помилки рахуються з поточних даних на кожному рендері. Показуємо помилку поля, коли користувач
  // залишив поле (blur) або натиснув "Place order" — а не одразу, поки він ще друкує.
  const allErrors = validate(form)
  const errors = Object.fromEntries(Object.entries(allErrors).filter(([field]) => submitted || touched[field]))
  const isComplete = Object.keys(allErrors).length === 0

  // Оновлення одного поля. Якщо форма вже відправлялась — одразу перевіряємо знову (помилка зникає, щойно поле виправлене)
  // Форматування для окремих полів: номер картки групуємо по 4 цифри, термін дії — "MM / YY"
  const FORMATTERS = { cardNumber: formatCardNumber, cardExpiry: formatExpiry, cardCvc: (v) => v.replace(/\D/g, '').slice(0, 3) }

  function update(field, value) {
    const next = { ...form, [field]: FORMATTERS[field] ? FORMATTERS[field](value) : value }
    if (field === 'carrier') { next.deliveryMethod = ''; next.deliveryPoint = '' } // інший перевізник — інші способи
    if (field === 'deliveryMethod' || field === 'city') next.deliveryPoint = ''
    setForm(next)
  }
  const bind = (field) => ({
    value: form[field],
    onChange: (event) => update(field, event.target.value),
    onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
    error: errors[field],
  })

  function goBackToCart() {
    openCart()
    if (location.key !== 'default') navigate(-1) // є попередня сторінка в історії — повертаємось на неї
    else navigate('/')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    const found = allErrors
    if (Object.keys(found).length > 0) {
      // a11y: переводимо фокус на перше поле з помилкою — користувач клавіатури/скрінрідера одразу там, де треба виправити
      const first = FIELD_ORDER.find((name) => found[name])
      formRef.current?.querySelector(`[name="${first}"], #${first}`)?.focus()
      return
    }

    setStatus('sending')
    setServerError('')

    // ДЕМО для захисту: справжньої платіжної системи немає, тому тестова картка 4000 0000 0000 0002
    // імітує відхилений платіж і показує екран "Payment failed" (за прикладом тестових карток платіжних сервісів)
    if (form.paymentMethod === 'CARD_ONLINE' && form.cardNumber.replace(/\s/g, '') === '4000000000000002') {
      setStatus('failed')
      return
    }
    const deliveryPoint = form.deliveryMethod === 'COURIER'
      ? [form.street.trim(), form.apartment.trim() && `apt. ${form.apartment.trim()}`].filter(Boolean).join(', ')
      : form.deliveryPoint
    try {
      const order = await placeOrder({
        email: form.email.trim(),
        phone: form.phone.trim(),
        carrier: form.carrier,
        deliveryMethod: form.deliveryMethod,
        city: form.city,
        deliveryPoint,
        recipientName: form.recipientName.trim(),
        paymentMethod: form.paymentMethod,
        cardNumber: form.paymentMethod === 'CARD_ONLINE' ? form.cardNumber.replace(/\s/g, '') : null,
        cardExpiry: form.paymentMethod === 'CARD_ONLINE' ? form.cardExpiry : null,
        cardCvc: form.paymentMethod === 'CARD_ONLINE' ? form.cardCvc : null,
        discountCode: promoApplied ? form.discountCode.trim() : null,
      })
      await refreshCart() // бекенд очистив кошик після замовлення
      navigate('/checkout/success', { state: { order, recipient: form.recipientName.trim() } })
    } catch (err) {
      if (form.paymentMethod === 'CARD_ONLINE') setStatus('failed') // екран "Payment failed"
      else { setStatus('idle'); setServerError(err.message) }
    }
  }

  // ---------- Екран помилки оплати (макет Checkout Error) ----------
  if (status === 'failed') {
    return (
      <>
        <MinimalHeader backLabel="Back to checkout" onBack={() => setStatus('idle')} />
        <main id="main" className={`container ${styles.result}`}>
          <span className={`${styles.resultIcon} ${styles.resultError}`} aria-hidden="true"><span className="icon">close</span></span>
          <h1 className={styles.resultTitle}>Payment failed</h1>
          <p role="alert" className={styles.resultText}>We couldn’t process your payment. Please try again or choose another payment method.</p>
          {/* Дані форми збережені — "Try again" повертає до заповненої форми */}
          <div className={styles.resultActions}>
            <Button onClick={() => setStatus('idle')}>Try again</Button>
            <Button variant="secondary" to="/info/contact">Contact support</Button>
          </div>
        </main>
      </>
    )
  }

  // ---------- Порожній кошик ----------
  if (cart && items.length === 0) {
    return (
      <>
        <MinimalHeader backLabel="Back to shop" backTo="/" />
        <main id="main" className={`container ${styles.result}`}>
          <h1 className={styles.resultTitle}>Your cart is empty</h1>
          <p className={styles.resultText}>Add some gear to your cart before checking out.</p>
          <div className={styles.resultActions}><Button to="/catalog">Explore gear</Button></div>
        </main>
      </>
    )
  }

  return (
    <>
      <MinimalHeader backLabel="Back to cart" onBack={goBackToCart} />
      <main id="main" className={`container ${styles.page}`}>
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* noValidate — вимикаємо стандартні спливаючі підказки браузера, показуємо свої, зрозуміліші */}
          <div className={styles.intro}>
            <h1>Checkout</h1>
            <p>Complete your order in a few quick details.</p>
          </div>

          <section className={styles.section} aria-labelledby="contact-title">
            <h2 id="contact-title">Contact</h2>
            <div className={styles.row}>
              <TextField id="email" name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required {...bind('email')} />
              <TextField id="phone" name="phone" label="Phone number" type="tel" autoComplete="tel" placeholder="+380 67 123 4567" required {...bind('phone')} />
            </div>
          </section>

          <section className={styles.section} aria-labelledby="delivery-title">
            <h2 id="delivery-title">Delivery</h2>
            <OptionCards legend="Carrier" name="carrier" options={CARRIERS} value={form.carrier} onChange={(v) => update('carrier', v)} error={errors.carrier} />

            {/* Поступове розкриття: місто й способи отримання з'являються після вибору перевізника */}
            {form.carrier && (
              <>
                <SelectField id="city" name="city" label="City" required options={CITIES} {...bind('city')} />
                <OptionCards
                  legend="Delivery method"
                  name="deliveryMethod"
                  columns={methods.length}
                  options={methods.map((m) => ({ ...m, hint: m.cost ? formatPrice(m.cost) : 'Free' }))}
                  value={form.deliveryMethod}
                  onChange={(v) => update('deliveryMethod', v)}
                  error={errors.deliveryMethod}
                />

                {form.deliveryMethod === 'COURIER' && (
                  <div className={styles.addressRow}>
                    <TextField id="street" name="street" label="Street and house" autoComplete="address-line1" placeholder="12 Khreshchatyk St" required {...bind('street')} />
                    <TextField id="apartment" name="apartment" label="Apartment" autoComplete="address-line2" placeholder="4B" {...bind('apartment')} />
                  </div>
                )}
                {form.deliveryMethod && form.deliveryMethod !== 'COURIER' && (
                  <SelectField
                    id="deliveryPoint"
                    name="deliveryPoint"
                    label={`${form.carrier === 'NOVA_POSHTA' ? 'Nova Poshta' : 'Ukrposhta'} ${form.deliveryMethod === 'PARCEL_LOCKER' ? 'parcel locker' : form.carrier === 'UKRPOSHTA' ? 'branch (postal code)' : 'branch'}`}
                    required
                    options={points}
                    {...bind('deliveryPoint')}
                  />
                )}

                <TextField id="recipientName" name="recipientName" label="Recipient full name" autoComplete="name" placeholder="As in your ID" required {...bind('recipientName')} />
              </>
            )}
          </section>

          <section className={styles.section} aria-labelledby="payment-title">
            <h2 id="payment-title">Payment</h2>
            <OptionCards legend="Payment method" name="paymentMethod" options={PAYMENT_OPTIONS} value={form.paymentMethod} onChange={(v) => update('paymentMethod', v)} />
            {form.paymentMethod === 'CARD_ONLINE' ? (
              <fieldset className={styles.card}>
                <legend className="visually-hidden">Card details</legend>
                <TextField id="cardNumber" name="cardNumber" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength={19} {...bind('cardNumber')} />
                <TextField id="cardExpiry" name="cardExpiry" label="Expiry date" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" maxLength={7} {...bind('cardExpiry')} />
                <TextField id="cardCvc" name="cardCvc" label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={3} {...bind('cardCvc')} />
              </fieldset>
            ) : (
              <p className={styles.note}>Pay in cash or by card when you collect your order. The carrier charges a small cash-on-delivery fee.</p>
            )}
          </section>

          <div className={styles.submit}>
            {serverError && <p role="alert" className={styles.serverError}>{serverError}</p>}
            {/* Кнопка НЕ disabled: неактивна кнопка не пояснює, що не так. Вона лише виглядає приглушено,
                а клік показує, які поля треба виправити. */}
            <Button type="submit" className={`${styles.placeOrder} ${isComplete ? '' : styles.placeOrderIdle}`} disabled={status === 'sending'}>
              {status === 'sending' ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
            </Button>
            <p className={styles.hint} aria-live="polite">
              {!isComplete && (submitted ? 'Fix the highlighted fields to place your order.' : 'Fill in all required fields to place your order.')}
            </p>
            <p className={styles.secure}><span className="icon" aria-hidden="true">lock</span>Secure checkout · Your payment information is encrypted.</p>
            <p className={styles.help}>Need help? <Link to="/info/contact">Contact support</Link></p>
          </div>
        </form>

        {/* ---------- Підсумок замовлення ---------- */}
        <aside className={styles.summary} aria-labelledby="summary-title">
          <h2 id="summary-title">Order summary</h2>
          <p className={styles.summaryCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          <ul className={styles.summaryItems}>
            {items.map((item) => (
              <li key={item.id}>
                <div className={styles.summaryThumb}>{item.imageUrl && <img src={assetUrl(item.imageUrl)} alt="" />}</div>
                <div className={styles.summaryInfo}>
                  <p className={styles.summaryName}>{item.name}</p>
                  <p className={styles.summaryMeta}>{item.color && <>Color: {colorName(item.color)} · </>}Quantity: {item.quantity}</p>
                </div>
                <p className={styles.summaryPrice}>{formatPrice(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <div className={styles.promo}>
            <button type="button" className={styles.promoToggle} aria-expanded={promoOpen} aria-controls="promo-panel" onClick={() => setPromoOpen((v) => !v)}>
              Have a discount code?
              <span className="icon" aria-hidden="true">{promoOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            <div id="promo-panel" hidden={!promoOpen}>
              <div className={styles.promoRow}>
                <label htmlFor="discountCode" className="visually-hidden">Discount code</label>
                <input
                  id="discountCode"
                  className={styles.promoInput}
                  placeholder="Discount code"
                  value={form.discountCode}
                  onChange={(event) => { update('discountCode', event.target.value); setPromoApplied(false) }}
                />
                <button type="button" className={styles.promoApply} disabled={!form.discountCode.trim()} onClick={() => setPromoApplied(true)}>Apply</button>
              </div>
              {/* Бекенд перевіряє код лише під час оформлення, тому знижка відобразиться в підсумку замовлення */}
              {promoApplied && <p role="status" className={styles.promoNote}>Code saved — the discount will be applied when you place the order.</p>}
            </div>
          </div>

          <dl className={styles.totals}>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div>
              <dt>Shipping</dt>
              <dd className={shipping === 0 ? styles.free : ''}>{shipping === null ? 'Calculated at next step' : shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className={styles.total}><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </main>
    </>
  )
}
