import { Link } from 'react-router'
import { assetUrl } from '../../api/client.js'
import { formatPrice, categoryLabel } from '../../utils/format.js'
import styles from './ProductCard.module.css'

// Картка товару — використовується на головній, у каталозі та в "Збереженому".
// Пропси: product — дані з API; onAddToCart / onToggleFavorite — дії (передає батько); isFavorite — стан "серця".
export default function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite = false }) {
  const { id, name, category, description, price, discountPercent, inStock, isNew, imageUrl } = product

  return (
    // <article> — самостійний блок контенту (семантика). Посилання — лише на назві,
    // а розтягується на всю картку через CSS. Так кнопки всередині не вкладені в <a> (це було б невалідно).
    <article className={styles.card}>
      <div className={styles.media}>
        <div className={styles.glow} aria-hidden="true" />
        {imageUrl
          ? <img src={assetUrl(imageUrl)} alt={name} className={styles.image} loading="lazy" />
          : <span className={`icon ${styles.placeholder}`} aria-hidden="true">image</span>}

        {discountPercent > 0
          ? <span className={`${styles.badge} ${styles.badgeDiscount}`}>-{discountPercent}%</span>
          : isNew && <span className={styles.badge}>New</span>}

      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{categoryLabel(category)}</span>
          <span className={inStock ? styles.inStock : styles.outOfStock}>
            <span className={styles.dot} aria-hidden="true" />
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <h3 className={styles.title}>
          <Link to={`/product/${id}`} className={styles.link}>{name}</Link>
        </h3>
        {/* "Серце" стоїть у коді ПІСЛЯ назви, щоб порядок Tab був логічним: товар -> зберегти -> кошик.
            Візуально воно все одно в правому верхньому куті (position: absolute). */}
        <button
          type="button"
          className={styles.favorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${name} from saved` : `Save ${name}`}
          onClick={() => onToggleFavorite?.(product)}
        >
          <span className={`icon ${isFavorite ? styles.filled : ''}`} aria-hidden="true">favorite</span>
        </button>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(price)}</span>
          <button
            type="button"
            className={styles.cartButton}
            disabled={!inStock}
            aria-label={`Add ${name} to cart`}
            onClick={() => onAddToCart?.(product)}
          >
            <span className="icon" aria-hidden="true">shopping_cart</span>
          </button>
        </div>
      </div>
    </article>
  )
}
