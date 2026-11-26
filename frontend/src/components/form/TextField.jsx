import styles from './Form.module.css'

// Поле форми з підписом і повідомленням про помилку.
// a11y: <label htmlFor> пов'язаний з полем; aria-invalid позначає помилку;
// aria-describedby "прив'язує" текст помилки — скрінрідер прочитає його разом із полем.
export default function TextField({ id, label, error, required = false, className = '', ...inputProps }) {
  const errorId = `${id}-error`
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        className={`${styles.input} ${error ? styles.invalid : ''}`}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          <span className="icon" aria-hidden="true">error</span>{error}
        </p>
      )}
    </div>
  )
}
