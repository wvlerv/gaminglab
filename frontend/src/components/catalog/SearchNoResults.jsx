import { Link } from 'react-router'
import Button from '../ui/Button.jsx'
import ProductCard from '../product/ProductCard.jsx'
import { useApi } from '../../hooks/useApi.js'
import { getPopular } from '../../api/products.js'
import styles from './SearchNoResults.module.css'

// Сторінка "нічого не знайдено" для пошуку (макет "Search No Results 1440px"):
// хлібні крихти -> блок з пунктирною рамкою (іконка, заголовок, порада, кнопка) -> "Popular right now" (4 картки).
// Пропс query — текст пошуку, який показуємо в заголовку.
export default function SearchNoResults({ query }) {
  // Популярні товари з бекенду (GET /api/products/popular), показуємо перші 4
  const { data: popular } = useApi(getPopular, [])

  return (
    <div className={`container ${styles.page}`}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/">Home</Link> / <span aria-current="page">Search</span>
      </nav>

      <section className={styles.empty} aria-labelledby="no-results-title">
        <span className={styles.iconCircle} aria-hidden="true">
          <span className={`icon ${styles.icon}`}>search</span>
        </span>
        <div className={styles.text}>
          <h1 id="no-results-title" className={styles.title}>No results for “{query}”</h1>
          <p className={styles.hint}>Check the spelling or try a more general term — or explore the most popular gear below.</p>
        </div>
        <Button to="/catalog" className={styles.browse}>Browse all gear</Button>
      </section>

      {popular?.length > 0 && (
        <section className={styles.popular} aria-labelledby="popular-title">
          <div className={styles.popularHead}>
            <h2 id="popular-title">Popular right now</h2>
            {/* На телефоні в макеті — короткий підпис "View all" без стрілки */}
            <Button variant="link" to="/catalog" iconRight="arrow_forward" className={styles.viewAll}>
              <span className={styles.labelFull}>View all products</span>
              <span className={styles.labelShort}>View all</span>
            </Button>
          </div>
          <ul className={styles.grid}>
            {popular.slice(0, 4).map((product) => (
              <li key={product.id}><ProductCard product={product} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
