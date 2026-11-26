import { useState } from 'react'
import { Link } from 'react-router'
import styles from './Footer.module.css'

// Колонки навігації описані даними — розмітка одна для всіх трьох
const COLUMNS = [
  { title: 'Shop', links: [
    { to: '/catalog/pc', label: 'PC' },
    { to: '/catalog/console', label: 'Console' },
    { to: '/catalog/accessories', label: 'Accessories' },
    { to: '/catalog', label: 'All products' },
  ] },
  { title: 'Support', links: [
    { to: '/info/shipping', label: 'Shipping' },
    { to: '/info/returns', label: 'Returns' },
    { to: '/info/warranty', label: 'Warranty' },
    { to: '/info/help', label: 'Help Center' },
  ] },
  { title: 'Company', links: [
    { to: '/info/about', label: 'About Us' },
    { to: '/info/careers', label: 'Careers' },
    { to: '/info/blog', label: 'Blog' },
    { to: '/info/contact', label: 'Contact' },
  ] },
]

const SOCIALS = ['discord', 'youtube', 'instagram', 'x', 'tiktok']
const SOCIAL_NAMES = { discord: 'Discord', youtube: 'YouTube', instagram: 'Instagram', x: 'X (Twitter)', tiktok: 'TikTok' }

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(event) {
    event.preventDefault()
    setSubscribed(true) // бекенду для розсилки немає — показуємо лише підтвердження
    setEmail('')
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>Gaming<span>Lab</span></Link>
            <p className={styles.tagline}>For a better way to play.</p>
          </div>

          <nav aria-label="Footer" className={styles.columns}>
            {COLUMNS.map((column) => (
              <div key={column.title} className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className={styles.newsletter}>
            <h2 className={styles.columnTitle}>Join our newsletter</h2>
            <p className={styles.tagline}>Get the last gear, drops and deals.</p>
            <form className={styles.subscribe} onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="visually-hidden">Your email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" aria-label="Subscribe" disabled={!email}>
                <span className="icon" aria-hidden="true">arrow_forward</span>
              </button>
            </form>
            {/* role="status" — скрінрідер озвучить повідомлення, коли воно з'явиться */}
            <p role="status" className={styles.success}>{subscribed ? 'Thanks! You are subscribed.' : ''}</p>

            <ul className={styles.socials}>
              {SOCIALS.map((name) => (
                <li key={name}>
                  <a href="#" aria-label={SOCIAL_NAMES[name]}>
                    <img src={`/images/social/${name}.svg`} alt="" width="20" height="20" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 GamingLab. All rights reserved.</p>
          <div className={styles.legal}>
            <Link to="/info/terms">Terms</Link>
            <Link to="/info/privacy">Privacy</Link>
            <Link to="/info/cookies">Cookies</Link>
            <span className={styles.lang}><span className="icon" aria-hidden="true">language</span>EN</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
