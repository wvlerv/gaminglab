import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import ConfirmDialog from '../ui/ConfirmDialog.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './AccountLayout.module.css'

// Каркас кабінету: хлібні крихти, заголовок, бокове меню (Profile / My orders / Log out) і вміст праворуч.
// Пропси: crumbs — [{ to, label }]; title / subtitle; children — вміст розділу.
export default function AccountLayout({ crumbs, title, subtitle, titleExtra, children, aside }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirmLogout, setConfirmLogout] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className={`container ${styles.page}`}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol>
          <li><Link to="/">Home</Link></li>
          {crumbs.map((crumb, index) => (
            <li key={crumb.label} aria-current={index === crumbs.length - 1 ? 'page' : undefined}>
              {crumb.to && index < crumbs.length - 1 ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}
            </li>
          ))}
        </ol>
      </nav>

      <header className={styles.head}>
        {titleExtra}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      <div className={`${styles.layout} ${aside ? styles.withAside : ''}`}>
        <aside className={styles.sidebar} aria-label="Account">
          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <nav aria-label="Account sections">
            <ul className={styles.menu}>
              <li>
                <NavLink to="/account" end className={({ isActive }) => `${styles.menuLink} ${isActive ? styles.active : ''}`}>
                  <span className="icon" aria-hidden="true">person</span>Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/account/orders" className={({ isActive }) => `${styles.menuLink} ${isActive ? styles.active : ''}`}>
                  <span className="icon" aria-hidden="true">package_2</span>My orders
                </NavLink>
              </li>
            </ul>
          </nav>
          <button type="button" className={styles.logout} onClick={() => setConfirmLogout(true)}>
            <span className="icon" aria-hidden="true">logout</span>Log out
          </button>
        </aside>

        <div className={styles.content}>{children}</div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>

      <ConfirmDialog
        open={confirmLogout}
        icon="logout"
        title="Log out of GamingLab?"
        text="You’ll need to sign in again to see your orders and saved gear. Your cart will stay on this device."
        confirmLabel="Log out"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  )
}
