import { useEffect } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import styles from './AddedToast.module.css'

// Коротке повідомлення "Added to cart" після кліку на кошик у картці товару (макет "Overlay / Added to cart").
// role="status" — скрінрідер озвучить повідомлення, не перериваючи користувача.
export default function AddedToast() {
  const { lastAdded, clearLastAdded, openCart, isOpen } = useCart()

  useEffect(() => {
    if (!lastAdded) return
    const timer = setTimeout(clearLastAdded, 4000) // ховаємо через 4 секунди
    return () => clearTimeout(timer)
  }, [lastAdded, clearLastAdded])

  const visible = lastAdded && !isOpen
  return (
    <div role="status" className={styles.region}>
      {visible && (
        <div className={styles.toast}>
          <span className={`icon ${styles.ok}`} aria-hidden="true">check_circle</span>
          <p><strong>{lastAdded.product.name}</strong> added to cart</p>
          <button type="button" className={styles.view} onClick={() => { clearLastAdded(); openCart() }}>View cart</button>
        </div>
      )}
    </div>
  )
}
