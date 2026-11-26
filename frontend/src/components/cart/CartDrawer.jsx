import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Button from '../ui/Button.jsx'
import QuantityCounter from '../ui/QuantityCounter.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { assetUrl } from '../../api/client.js'
import { formatPrice } from '../../utils/format.js'
import { colorName } from '../../utils/colors.js'
import styles from './CartDrawer.module.css'

// Бічна панель кошика (у PRD — "інтерактивний кошик, виїзна бічна панель поверх сторінки").
// Використовуємо нативний <dialog> з showModal(): браузер сам
//  • утримує фокус клавіатури всередині панелі,
//  • закриває її клавішею Esc,
//  • робить решту сторінки недоступною, поки кошик відкритий.
export default function CartDrawer() {
  const { cart, count, isOpen, closeCart, updateItem, removeItem } = useCart()
  const dialogRef = useRef(null)
  const [error, setError] = useState('')

  // Синхронізуємо стан із Context (isOpen) з реальним елементом <dialog>
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  async function run(action) {
    setError('')
    try { await action() } catch (err) { setError(err.message) }
  }

  const items = cart?.items ?? []

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-labelledby="cart-title"
      onClose={closeCart}                                   // Esc або dialog.close()
      onClick={(event) => { if (event.target === dialogRef.current) closeCart() }} // клік по затемненню
    >
      <div className={styles.panel}>
        <header className={styles.head}>
          <h2 id="cart-title">
            Your Cart
            {count > 0 && <span className={styles.count}>({count} {count === 1 ? 'item' : 'items'})</span>}
          </h2>
          <button type="button" className={styles.close} onClick={closeCart} aria-label="Close cart">
            <span className="icon" aria-hidden="true">close</span>
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true"><span className="icon">shopping_cart</span></span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven’t added any gear yet. Explore our collection and find your perfect setup.</p>
            <Button to="/catalog" onClick={closeCart}>Explore gear</Button>
          </div>
        ) : (
          <>
            <ul className={styles.items}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.thumb}>
                    {item.imageUrl && <img src={assetUrl(item.imageUrl)} alt="" />}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <Link to={`/product/${item.productId}`} onClick={closeCart} className={styles.itemName}>{item.name}</Link>
                      <button type="button" className={styles.remove} onClick={() => run(() => removeItem(item.id))} aria-label={`Remove ${item.name} from cart`}>
                        <span className="icon" aria-hidden="true">delete</span>
                      </button>
                    </div>
                    {item.color && <p className={styles.itemMeta}>Color: {colorName(item.color)}</p>}
                    <div className={styles.itemRow}>
                      <QuantityCounter
                        size="sm"
                        value={item.quantity}
                        label={`Quantity of ${item.name}`}
                        onChange={(value) => run(() => updateItem(item.id, value))}
                      />
                      <span className={styles.itemPrice}>{formatPrice(item.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className={styles.foot}>
              {error && <p role="alert" className={styles.error}>{error}</p>}
              {/* <dl> — пари "назва: значення" (Subtotal: 17 598 UAH) */}
              <dl className={styles.summary}>
                <div><dt>Subtotal</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
                <div className={styles.total}><dt>Total</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
              </dl>
              <Button to="/checkout" onClick={closeCart} className={styles.checkout}>Go to checkout</Button>
            </footer>
          </>
        )}
      </div>
    </dialog>
  )
}
