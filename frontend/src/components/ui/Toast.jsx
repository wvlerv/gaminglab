import { useEffect } from 'react'
import styles from './Toast.module.css'

// Повідомлення у правому верхньому куті ("Changes saved"). role="status" — скрінрідер озвучить текст.
// Пропси: message ({ title, text } або null), onClose — ховає повідомлення (автоматично через 4 с).
export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div role="status" className={styles.region}>
      {message && (
        <div className={styles.toast}>
          <span className={`icon ${styles.ok}`} aria-hidden="true">check</span>
          <div className={styles.body}>
            <p className={styles.title}>{message.title}</p>
            {message.text && <p className={styles.text}>{message.text}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss notification">
            <span className="icon" aria-hidden="true">close</span>
          </button>
        </div>
      )}
    </div>
  )
}
