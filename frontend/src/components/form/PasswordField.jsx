import { useState } from 'react'
import styles from './Form.module.css'

// Поле пароля з кнопкою "показати/сховати" (іконка ока в макеті).
// a11y: кнопка має підпис і aria-pressed — скрінрідер скаже "Show password, toggle button, not pressed".
export default function PasswordField({ id, label, error, hint, required = false, ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <div className={styles.passwordWrap}>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`${styles.input} ${error ? styles.invalid : ''}`}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...inputProps}
        />
        <button
          type="button"
          className={styles.eye}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <span className="icon" aria-hidden="true">{visible ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
      {hint && !error && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-error`} className={styles.error}><span className="icon" aria-hidden="true">error</span>{error}</p>}
    </div>
  )
}
