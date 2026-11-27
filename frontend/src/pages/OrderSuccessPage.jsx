import { useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import MinimalHeader from '../components/layout/MinimalHeader.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice } from '../utils/format.js'
import { colorName } from '../utils/colors.js'
import styles from './CheckoutPage.module.css'

const DELIVERY_LABELS = { BRANCH: 'Pickup', PARCEL_LOCKER: 'Parcel locker', COURIER: 'Courier delivery', PICKUP: 'Pickup' }
const PAYMENT_LABELS = { CARD_ONLINE: 'Card online', PAY_ON_DELIVERY: 'Pay on delivery' }

// Екран "Order confirmed!" (макет Checkout Success). Дані замовлення приходять зі сторінки оформлення через state роутера.
export default function OrderSuccessPage() {
  const { state } = useLocation()
  const { isLoggedIn } = useAuth()
  const [showDetails, setShowDetails] = useState(false)

  if (!state?.order) return <Navigate to="/" replace /> // відкрили адресу напряму — немає що показувати
  const { order, recipient } = state
  const firstName = recipient?.split(' ')[0]
  const itemsTotal = order.items.reduce((sum, item) => sum + Number(item.lineTotal), 0)
  const discount = Math.round(itemsTotal + Number(order.shippingCost) - Number(order.total))

  return (
    <>
      <MinimalHeader backLabel="Back to shop" backTo="/" title="Back to shop" />
      <main id="main" className={`container ${styles.result}`}>
        <span className={`${styles.resultIcon} ${styles.resultSuccess}`} aria-hidden="true"><span className="icon">check</span></span>
        <h1 className={styles.resultTitle}>Order confirmed!</h1>
        <p className={styles.resultText}>Thanks{firstName ? `, ${firstName}` : ''}. We’ve received your order.</p>

        <dl className={styles.orderCard}>
          <div><dt>Order number</dt><dd>#{order.orderNumber}</dd></div>
          <div><dt>{DELIVERY_LABELS[order.deliveryMethod] ?? 'Delivery'}</dt><dd>{order.deliveryPoint}</dd></div>
          <div><dt>Payment</dt><dd>{PAYMENT_LABELS[order.paymentMethod]}</dd></div>
        </dl>

        {showDetails && (
          <ul className={styles.orderItems} aria-label="Order items">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.color}`}>
                <span>{item.name}{item.color && ` · ${colorName(item.color)}`} × {item.quantity}</span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
            {Number(order.shippingCost) > 0 && <li><span>Shipping</span><span>{formatPrice(order.shippingCost)}</span></li>}
            {/* Бекенд не повертає знижку окремим полем — рахуємо її як різницю: товари + доставка − підсумок */}
            {discount > 0 && <li><span>Promo discount</span><span className={styles.discount}>−{formatPrice(discount)}</span></li>}
            {/* Підсумок — у деталях (у макеті в картці лише номер, доставка й оплата) */}
            <li><span>Total</span><span className={styles.orderTotal}>{formatPrice(order.total)}</span></li>
          </ul>
        )}

        <p className={styles.resultHint}>A receipt and pickup details are on their way to your email.</p>
        <div className={styles.resultActions}>
          <Button to="/catalog">Continue shopping</Button>
          {/* Увійшли — замовлення прив'язане до акаунта, ведемо на сторінку деталей у кабінеті.
              Гість кабінету не має, тож для нього деталі розгортаються тут же, під карткою */}
          {isLoggedIn ? (
            <Button variant="secondary" to={`/account/orders/${order.orderNumber}`}>View order details</Button>
          ) : (
            <Button variant="secondary" aria-expanded={showDetails} onClick={() => setShowDetails((v) => !v)}>
              {showDetails ? 'Hide order details' : 'View order details'}
            </Button>
          )}
        </div>
      </main>
    </>
  )
}
