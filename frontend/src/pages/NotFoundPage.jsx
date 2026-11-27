import { Link } from 'react-router'
import Button from '../components/ui/Button.jsx'
import styles from './NotFoundPage.module.css'

// Сторінка 404 (макет "404 Desktop"): показується для будь-якої невідомої адреси
export default function NotFoundPage() {
  return (
    <div className={`container ${styles.page}`}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/">Home</Link> / <span aria-current="page">404</span>
      </nav>
      <div className={styles.layout}>
        <div className={styles.textCol}>
          <p className={styles.eyebrow}>404 / Out of bounds</p>
          {/* Перенос як у макеті: "Looks like / you’re" (рядок переноситься сам за шириною) / "off the map." */}
          <h1 className={styles.title}>Looks like you’re<br />off the map.</h1>
          <p className={styles.text}>The page you’re looking for doesn’t exist or has moved.<br />Your next setup upgrade is still waiting.</p>
          <div className={styles.actions}>
            <Button to="/catalog">Explore gear</Button>
            <Button variant="secondary" to="/">Respawn at home</Button>
          </div>
        </div>
        <figure className={styles.figure}>
          {/* Ілюстрація декоративна — alt="" (зміст сторінки передає текст ліворуч) */}
          <img src="/images/404.png" alt="" />
          <figcaption aria-hidden="true">Signal lost · Location unknown</figcaption>
        </figure>
      </div>
    </div>
  )
}
