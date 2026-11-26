import styles from './QuantityCounter.module.css'

// Лічильник "− 1 +". Використовується на сторінці товару і в кошику — один компонент, різні пропси.
//   value — поточна кількість; onChange(newValue) — що робити при зміні; min / max — межі;
//   label — для скрінрідера ("Quantity of Viper V3 Pro"); size — 'md' | 'sm'
export default function QuantityCounter({ value, onChange, min = 1, max = Infinity, label = 'Quantity', size = 'md', disabled = false }) {
  return (
    <div className={`${styles.counter} ${styles[size]}`} role="group" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>
        <span className="icon" aria-hidden="true">remove</span>
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label="Increase quantity" disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
        <span className="icon" aria-hidden="true">add</span>
      </button>
    </div>
  )
}
