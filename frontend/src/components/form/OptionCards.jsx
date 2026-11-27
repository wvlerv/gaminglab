import styles from './Form.module.css'

// Вибір одного варіанта у вигляді карток (перевізник, спосіб отримання, оплата).
// Усередині — справжні радіокнопки в <fieldset>: стрілки ←/→ перемикають варіанти, скрінрідер читає "1 з 3".
// Пропси: legend — назва групи; name — ім'я групи; options — [{ value, label, hint, icon }]; value / onChange.
// hideLegend — назву групи чує лише скрінрідер (у макеті над картками оплати підпису немає).
export default function OptionCards({ legend, name, options, value, onChange, error, columns = 2, hideLegend = false }) {
  const errorId = `${name}-error`
  return (
    <fieldset className={styles.fieldset} aria-describedby={error ? errorId : undefined}>
      <legend className={hideLegend ? 'visually-hidden' : styles.label}>{legend}</legend>
      <div className={styles.cards} style={{ '--columns': columns, '--cards-gap': columns > 2 ? '12px' : '16px' }}>
        {options.map((option) => (
          <label key={option.value} className={`${styles.card} ${value === option.value ? styles.cardChecked : ''} ${error ? styles.invalid : ''}`}>
            <span className={`icon ${styles.cardIcon}`} aria-hidden="true">{option.icon}</span>
            <span className={styles.cardText}>
              <span className={styles.cardTitle}>{option.label}</span>
              {option.hint && <span className={styles.cardHint}>{option.hint}</span>}
            </span>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={styles.radio}
            />
          </label>
        ))}
      </div>
      {error && <p id={errorId} className={styles.error}><span className="icon" aria-hidden="true">error</span>{error}</p>}
    </fieldset>
  )
}
