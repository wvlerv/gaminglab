import { Link } from 'react-router'
import Button from '../components/ui/Button.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import { useApi } from '../hooks/useApi.js'
import { getNewArrivals } from '../api/products.js'
import styles from './HomePage.module.css'

// Статичний контент головної описаний даними, а розмітка генерується через .map()
const ADVANTAGES = [
  { icon: 'local_shipping', title: 'Free shipping', text: 'To branch over 2 000 UAH' },
  { icon: 'verified_user', title: '2 year warranty', text: 'Play with confidence' },
  { icon: 'package_2', title: '30-day returns', text: 'Hassle free' },
  { icon: 'support_agent', title: 'Expert support', text: 'Gamers, for gamers' },
]

const BRANDS = [
  { name: 'Razer', logo: '/images/brands/razer.svg' },
  { name: 'Logitech', logo: '/images/brands/logitech.svg' },
  { name: 'SteelSeries', logo: '/images/brands/steelseries.svg' },
  { name: 'HyperX', logo: '/images/brands/hyperx.svg' },
  { name: 'Sony', logo: '/images/brands/sony.svg' },
]

const SETUPS = [
  { to: '/catalog/pc', title: 'PC Gaming', text: 'Mice, keyboards, headsets & more for peak performance.', cta: 'Shop PC', image: '/images/home/setup-pc.webp' },
  { to: '/catalog/console', title: 'Console Gaming', text: 'Controllers, headsets & accessories for every platform.', cta: 'Shop Console', image: '/images/home/setup-console.webp' },
  { to: '/catalog/accessories', title: 'Accessories', text: 'Mouse pads, charging docks, cables & more.', cta: 'Shop Accessories', image: '/images/home/setup-accessories.webp' },
]

export default function HomePage() {
  // Серверний стан: новинки приходять з бекенду (GET /api/products/new)
  const { data: newArrivals, loading, error } = useApi(getNewArrivals, [])

  return (
    <>
      {/* ---------- Hero banner ---------- */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className="container">
          <p className={styles.eyebrow}>Better gear. Brighter wins.</p>
          <h1 id="hero-title" className={styles.heroTitle}>Gear up.<br />Play better.</h1>
          <p className={styles.heroText}>
            Premium gaming peripherals for every player.<br />
            More control. More comfort. More wins.
          </p>
          <Button to="/catalog" iconRight="arrow_forward" className={styles.heroButton}>Shop all gear</Button>
          {/* Швидкі посилання на категорії під кнопкою (з оновленого макету головної) */}
          <nav aria-label="Popular categories">
            <ul className={styles.quick}>
              {[['Mice', 'Mouse'], ['Keyboards', 'Keyboards'], ['Headsets', 'Headsets'], ['Controllers', 'Controllers']].map(([label, category]) => (
                <li key={label}><Link to={`/catalog?category=${category}`}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ---------- New Arrivals ---------- */}
      <section className={`container ${styles.section}`} aria-labelledby="new-title">
        <div className={styles.sectionHead}>
          <h2 id="new-title">New Arrivals</h2>
          <Button variant="link" to="/catalog" iconRight="arrow_forward"><span>View all<span className={styles.longLabel}> products</span></span></Button>
        </div>

        {loading && <p className={styles.status}>Loading products…</p>}
        {error && <p className={styles.status} role="alert">Could not load products. Please try again later.</p>}
        {newArrivals && (
          <ul className={styles.productGrid}>
            {newArrivals.slice(0, 4).map((product) => (
              <li key={product.id}><ProductCard product={product} /></li>
            ))}
          </ul>
        )}

        <ul className={styles.advantages}>
          {ADVANTAGES.map((item) => (
            <li key={item.title} className={styles.advantage}>
              <span className={`icon ${styles.advantageIcon}`} aria-hidden="true">{item.icon}</span>
              <div>
                <p className={styles.advantageTitle}>{item.title}</p>
                <p className={styles.advantageText}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Featured brands ---------- */}
      <section className={`container ${styles.section}`} aria-labelledby="brands-title">
        <div>
          <h2 id="brands-title">Featured brands</h2>
          <p className={styles.subtitle}>Gear from the brands gamers trust.</p>
        </div>
        <ul className={styles.brands}>
          {BRANDS.map((brand) => (
            <li key={brand.name}>
              <Link to={`/catalog?brand=${brand.name}`} className={styles.brandLink}>
                <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Shop By Setup ---------- */}
      <section className={`container ${styles.section}`} aria-labelledby="setup-title">
        <div className={styles.sectionHead}>
          <h2 id="setup-title">Shop By Setup</h2>
          <Button variant="link" to="/catalog" iconRight="arrow_forward" className={styles.desktopOnly}>Find your perfect setup</Button>
        </div>
        <ul className={styles.setups}>
          {SETUPS.map((setup) => (
            <li key={setup.to}>
              <Link to={setup.to} className={styles.setupCard} style={{ backgroundImage: `url(${setup.image})` }}>
                <span className={styles.setupInfo}>
                  <span className={styles.setupTitle}>{setup.title}</span>
                  <span className={styles.setupText}>{setup.text}</span>
                </span>
                <span className={styles.setupCta}>
                  {setup.cta} <span className="icon" aria-hidden="true">arrow_forward</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
