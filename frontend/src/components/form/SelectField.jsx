import styles from './Form.module.css'

// Випадаючий список (місто, відділення). Нативний <select> — працює з клавіатури і скрінрідером без додаткового коду.
export default function SelectField({ id, label, error, required = false, options, placeholder = 'Select…', ...selectProps }) {
  const errorId = `${id}-error`
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <div className={styles.selectWrap}>
        <select
          id={id}
          className={`${styles.input} ${styles.select} ${error ? styles.invalid : ''}`}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...selectProps}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <span className={`icon ${styles.chevron}`} aria-hidden="true">expand_more</span>
      </div>
      {error && <p id={errorId} className={styles.error}><span className="icon" aria-hidden="true">error</span>{error}</p>}
    </div>
  )
}
