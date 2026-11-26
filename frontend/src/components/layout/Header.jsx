import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import styles from './Header.module.css'

// Пункти головного меню (з PRD: PC / Console / Accessories).
// Тримаємо їх у масиві, а не пишемо три однакові <NavLink> — менше дублювання.
const NAV_ITEMS = [
  { to: '/catalog/pc', label: 'PC' },
  { to: '/catalog/console', label: 'Console' },
  { to: '/catalog/accessories', label: 'Accessories' },
]

// Пропси: cartCount — кількість товарів у кошику, onCartClick — що робити при кліку на кошик.
// Header їх тільки ЧИТАЄ; звідки беруться — вирішує батьківський компонент (Layout).
export default function Header({ cartCount = 0, onCartClick }) {
  // Локальний стан: відкрите мобільне меню і текст у пошуку потрібні лише шапці
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(event) {
    event.preventDefault() // форма не перезавантажує сторінку — ми в SPA
    const text = query.trim()
    if (!text) return
    navigate(`/catalog?search=${encodeURIComponent(text)}`)
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="GamingLab — home page">
          Gaming<span className={styles.logoAccent}>Lab</span>
        </Link>

        {/* Кнопка-"бургер" видима лише на мобільних (див. CSS) */}
        <button
          type="button"
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="icon" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span>
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>

        <nav id="main-nav" aria-label="Main" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          {/* role="search" підказує скрінрідеру, що це пошук */}
          <form role="search" className={styles.search} onSubmit={handleSearch}>
            <label htmlFor="header-search" className="visually-hidden">Search products</label>
            <span className={`icon ${styles.searchIcon}`} aria-hidden="true">search</span>
            <input
              id="header-search"
              type="search"
              placeholder="Search for gear, brands ..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.searchInput}
            />
          </form>

          <Link to="/saved" className={styles.iconButton} aria-label="Saved items">
            <span className="icon" aria-hidden="true">favorite</span>
          </Link>

          <button type="button" className={styles.iconButton} onClick={onCartClick} aria-label={`Cart, ${cartCount} items`}>
            <span className="icon" aria-hidden="true">shopping_cart</span>
            {cartCount > 0 && <span className={styles.badge} aria-hidden="true">{cartCount}</span>}
          </button>

          <Link to="/login" className={styles.avatar} aria-label="Account">
            <span className="icon" aria-hidden="true">person</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
