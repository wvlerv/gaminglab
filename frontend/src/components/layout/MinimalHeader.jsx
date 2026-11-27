import { Link } from 'react-router'
import styles from './MinimalHeader.module.css'

// Спрощена шапка для оформлення замовлення (як у макеті Checkout): лише логотип і "назад".
// Менше відволікаючих посилань — менше шансів, що користувач піде з оформлення.
// На телефоні (макет Checkout Mobile) логотипу немає: стрілка "назад" і назва сторінки (title) поруч.
export default function MinimalHeader({ backLabel, backTo, onBack, title = 'Checkout' }) {
  // Вміст кнопки: на десктопі видно підпис "Back to cart", на телефоні — лише стрілку і назву сторінки
  // (підпис лишається для скрінрідера, а назва для нього дубль — тож aria-hidden)
  const content = (
    <>
      <span className="icon" aria-hidden="true">arrow_back</span>
      <span className={styles.label}>{backLabel}</span>
      <span className={styles.title} aria-hidden="true">{title}</span>
    </>
  )
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="GamingLab — home page">Gaming<span>Lab</span></Link>
        {onBack
          ? <button type="button" className={styles.back} onClick={onBack}>{content}</button>
          : <Link to={backTo} className={styles.back}>{content}</Link>}
      </div>
    </header>
  )
}
