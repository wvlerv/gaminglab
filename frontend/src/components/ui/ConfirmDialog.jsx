import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'
import styles from './ConfirmDialog.module.css'

// Модальне вікно підтвердження ("Cancel order?", "Log out?") на нативному <dialog>:
// фокус залишається всередині, Esc закриває, решта сторінки недоступна — як у кошику.
// Пропси: open, icon, title, text, confirmLabel, cancelLabel, onConfirm, onCancel, busy
export default function ConfirmDialog({ open, icon = 'close', title, text, confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel, busy = false }) {
  const ref = useRef(null)
  const id = useId() // унікальні id: на одній сторінці може бути кілька діалогів (вихід + скасування)
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-text`} onClose={onCancel}>
      <span className={styles.icon} aria-hidden="true"><span className="icon">{icon}</span></span>
      <h2 id={`${id}-title`} className={styles.title}>{title}</h2>
      <p id={`${id}-text`} className={styles.text}>{text}</p>
      <div className={styles.actions}>
        {/* Безпечна дія — перша і отримує фокус: випадковий Enter не скасує замовлення */}
        <Button variant="secondary" onClick={onCancel} autoFocus>{cancelLabel}</Button>
        <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? 'Please wait…' : confirmLabel}</Button>
      </div>
    </dialog>
  )
}
