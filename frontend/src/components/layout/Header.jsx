import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import SearchBox from './SearchBox.jsx'
import { MENU } from '../../data/menu.js'
import styles from './Header.module.css'

// Пропси: cartCount — кількість товарів у кошику, onCartClick — дія при кліку на кошик, user — хто увійшов.
// Header їх тільки ЧИТАЄ; звідки беруться — вирішує батьківський компонент (Layout).
export default function Header({ cartCount = 0, onCartClick, user }) {
  // Локальний стан: відкрите мобільне меню і відкритий розділ мегаменю потрібні лише шапці
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false) // мобільний пошук відкривається іконкою (як у мобільному макеті)
  const location = useLocation()
  const headerRef = useRef(null)
  const closeTimer = useRef(null)

  // Перейшли на іншу сторінку — закриваємо меню (стан "прив'язаний" до адреси)
  const [lastPath, setLastPath] = useState(location.pathname + location.search)
  if (lastPath !== location.pathname + location.search) {
    setLastPath(location.pathname + location.search)
    setOpenSection(null)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  // Esc закриває мегаменю і повертає фокус на його кнопку; клік поза шапкою — теж закриває
  useEffect(() => {
    if (!openSection) return
    const onKey = (event) => {
      if (event.key === 'Escape') {
        document.getElementById(`menu-button-${openSection}`)?.focus()
        setOpenSection(null)
      }
    }
    const onClick = (event) => { if (!headerRef.current?.contains(event.target)) setOpenSection(null) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [openSection])

  // Esc закриває мобільне меню або мобільний пошук
  useEffect(() => {
    if (!menuOpen && !searchOpen) return
    const onKey = (event) => { if (event.key === 'Escape') { setMenuOpen(false); setSearchOpen(false) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, searchOpen])

  // Наведення мишею відкриває розділ (на десктопі); невелика затримка, щоб меню не "блимало"
  const hoverOpen = (id) => { clearTimeout(closeTimer.current); if (window.matchMedia('(hover: hover) and (min-width: 769px)').matches) setOpenSection(id) }
  const hoverClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => { if (window.matchMedia('(min-width: 769px)').matches) setOpenSection(null) }, 150) }

  return (
    <header className={styles.header} ref={headerRef}>
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
          onClick={() => { setMenuOpen((open) => !open); setSearchOpen(false) }}
        >
          <span className="icon" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span>
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>

        <nav id="main-nav" aria-label="Main" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            {MENU.map((section) => {
              const isOpen = openSection === section.id
              const isCurrent = location.pathname.startsWith(section.to)
              return (
                <li key={section.id} onMouseEnter={() => hoverOpen(section.id)} onMouseLeave={hoverClose}>
                  {/* Шаблон "disclosure": кнопка з aria-expanded відкриває панель з посиланнями */}
                  <button
                    id={`menu-button-${section.id}`}
                    type="button"
                    className={`${styles.navLink} ${isOpen || isCurrent ? styles.navLinkActive : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={`menu-panel-${section.id}`}
                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                  >
                    {section.label}
                    <span className={`icon ${styles.chevron}`} aria-hidden="true">{isOpen ? 'expand_less' : 'expand_more'}</span>
                  </button>

                  <div id={`menu-panel-${section.id}`} className={styles.mega} hidden={!isOpen}>
                    <div className={`container ${styles.megaInner}`}>
                      {section.columns.map((column) => (
                        <div key={column.title}>
                          <p className={styles.megaTitle}>{column.title}</p>
                          <ul className={styles.megaLinks}>
                            {column.links.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}
                          </ul>
                        </div>
                      ))}
                      {/* Промо-картка (category card у макеті): фото на весь фон + затемнення, зверху плашка і текст, знизу "Shop now" */}
                      <Link
                        to={section.promo.to}
                        className={styles.promo}
                        style={section.promo.image ? { backgroundImage: `url(${section.promo.image})` } : undefined}
                      >
                        <span className={styles.promoTop}>
                          <span className={`${styles.promoBadge} ${section.promo.tone === 'discount' ? styles.promoDiscount : ''}`}>{section.promo.badge}</span>
                          <span className={styles.promoInfo}>
                            <span className={styles.promoTitle}>{section.promo.title}</span>
                            <span className={styles.promoText}>{section.promo.text}</span>
                          </span>
                        </span>
                        <span className={styles.promoCta}><span className={styles.promoCtaLabel}>Shop now</span> <span className="icon" aria-hidden="true">arrow_forward</span></span>
                      </Link>
                      <Link to={section.to} className={styles.megaAll}>Shop all {section.label} <span className="icon" aria-hidden="true">arrow_forward</span></Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Лише в мобільному меню (макет Menu Mobile): вхід/реєстрація або кабінет, "Збережене" */}
          <div className={styles.mobileExtras}>
            {user ? (
              <Link to="/account" className={styles.mobileAccount}>
                <span className={styles.initials} aria-hidden="true">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                My account
              </Link>
            ) : (
              <div className={styles.mobileAuth}>
                <Link to="/login" className={styles.mobileLogin}>Log in</Link>
                <Link to="/signup" className={styles.mobileSignup}>Create account</Link>
              </div>
            )}
            <Link to="/saved" className={styles.mobileLink}><span className="icon" aria-hidden="true">favorite</span>Favorites</Link>
          </div>
        </nav>

        <div className={styles.actions}>
          {/* На мобільних поле пошуку сховане за іконкою, на десктопі видиме завжди */}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.searchToggle}`}
            aria-expanded={searchOpen}
            aria-controls="header-search-slot"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            onClick={() => { setSearchOpen((v) => !v); setMenuOpen(false) }}
          >
            <span className="icon" aria-hidden="true">{searchOpen ? 'close' : 'search'}</span>
          </button>
          <div id="header-search-slot" className={`${styles.searchSlot} ${searchOpen ? styles.searchSlotOpen : ''}`}>
            <SearchBox onNavigate={() => { setMenuOpen(false); setSearchOpen(false) }} />
          </div>

          <Link to="/saved" className={styles.iconButton} aria-label="Saved items">
            <span className="icon" aria-hidden="true">favorite</span>
          </Link>

          <button type="button" className={styles.iconButton} onClick={onCartClick} aria-label={`Cart, ${cartCount} items`}>
            <span className="icon" aria-hidden="true">shopping_cart</span>
            {cartCount > 0 && <span className={styles.badge} aria-hidden="true">{cartCount}</span>}
          </button>

          {/* Увійшов — у кабінет (на аватарі ініціали), гість — на сторінку входу */}
          <Link to={user ? '/account' : '/login'} className={styles.avatar} aria-label={user ? `Account: ${user.firstName} ${user.lastName}` : 'Sign in'}>
            {user
              ? <span className={styles.initials} aria-hidden="true">{user.firstName?.[0]}{user.lastName?.[0]}</span>
              : <span className="icon" aria-hidden="true">person</span>}
          </Link>
        </div>
      </div>
      {/* Затемнення сторінки під відкритим мегаменю (Overlay Dimmer у макеті); клік по ньому закриває меню */}
      {openSection && <div className={styles.dimmer} aria-hidden="true" onClick={() => setOpenSection(null)} />}
    </header>
  )
}
