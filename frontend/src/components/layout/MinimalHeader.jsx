import { Link } from 'react-router'
import styles from './MinimalHeader.module.css'

// Спрощена шапка для оформлення замовлення (як у макеті Checkout): лише логотип і "назад".
// Менше відволікаючих посилань — менше шансів, що користувач піде з оформлення.
export default function MinimalHeader({ backLabel, backTo, onBack }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="GamingLab — home page">Gaming<span>Lab</span></Link>
        {onBack
          ? <button type="button" className={styles.back} onClick={onBack}><span className="icon" aria-hidden="true">arrow_back</span>{backLabel}</button>
          : <Link to={backTo} className={styles.back}><span className="icon" aria-hidden="true">arrow_back</span>{backLabel}</Link>}
      </div>
    </header>
  )
}
