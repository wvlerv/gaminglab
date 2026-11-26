import { Link } from 'react-router'
import styles from './Button.module.css'

// Одна кнопка на весь сайт. Вигляд задається пропсом variant, а не окремими компонентами:
//   variant: 'primary' (зелена) | 'secondary' (темна з рамкою) | 'link' (зелений текст)
//   to — якщо передали, кнопка стає посиланням роутера (<Link>), інакше це <button>
//   icon / iconRight — назва іконки Material Symbols
export default function Button({
  variant = 'primary',
  to,
  icon,
  iconRight,
  className = '',
  children,
  ...rest // усе інше (onClick, type, disabled, aria-*) передаємо далі як є
}) {
  const classes = `${styles.button} ${styles[variant]} ${className}`
  const content = (
    <>
      {icon && <span className="icon" aria-hidden="true">{icon}</span>}
      {children}
      {iconRight && <span className="icon" aria-hidden="true">{iconRight}</span>}
    </>
  )

  if (to) {
    return <Link to={to} className={classes} {...rest}>{content}</Link>
  }
  return <button type="button" className={classes} {...rest}>{content}</button>
}
