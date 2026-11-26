import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Button from '../components/ui/Button.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import QuantityCounter from '../components/ui/QuantityCounter.jsx'
import { useApi } from '../hooks/useApi.js'
import { useCart } from '../context/CartContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { getProduct, getFrequentlyBoughtTogether } from '../api/products.js'
import { assetUrl } from '../api/client.js'
import { formatPrice, categoryLabel } from '../utils/format.js'
import { colorName } from '../utils/colors.js'
import styles from './ProductPage.module.css'

const ALL_PLATFORMS = ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch']
const LOW_STOCK_LIMIT = 5

export default function ProductPage() {
  const { id } = useParams() // /product/5 -> id = "5"
  const { data: product, loading, error } = useApi(() => getProduct(id), [id])
  const { data: related } = useApi(() => getFrequentlyBoughtTogether(id), [id])

  if (loading && !product) return <p className={`container ${styles.message}`}>Loading product…</p>
  if (error) {
    return (
      <section className={`container ${styles.message}`}>
        <h1>Product not found</h1>
        <p>This product may have been removed.</p>
        <Button to="/catalog">Back to catalog</Button>
      </section>
    )
  }

  return (
    // key={product.id}: при переході на інший товар компонент створюється заново,
    // тож вибрані колір і кількість скидаються
    <ProductDetails key={product.id} product={product} related={related ?? []} />
  )
}

function ProductDetails({ product, related }) {
  const { addItem, openCart } = useCart()
  const favourites = useFavourites()
  const isFavourite = favourites.isFavourite(product.id)
  const colors = product.colors ?? []

  // ЛОКАЛЬНИЙ СТАН: потрібен лише на цій сторінці, поки товар не додано в кошик
  const [color, setColor] = useState(colors[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const { name, category, price, inStock, stock, rating, reviewCount, imageUrl, discountPercent } = product
  const lowStock = inStock && stock > 0 && stock <= LOW_STOCK_LIMIT
  const maxQuantity = Math.max(stock ?? 1, 1)

  async function handleAddToCart() {
    setStatus({ type: 'loading', message: '' })
    try {
      await addItem(product, quantity, color) // колір і кількість переходять у ГЛОБАЛЬНИЙ стан кошика
      setStatus({ type: 'success', message: `${name} added to cart.` })
      openCart()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  // Порядок рядків — як у макеті: Weight, Connection, Sensor, Battery
  const specs = [
    ['Weight', product.weight],
    ['Connection', product.connection],
    ['Sensor', product.sensor],
    ['Battery', product.battery],
  ].filter(([, value]) => value && value !== 'Not applicable')

  return (
    <div className={`container ${styles.page}`}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/catalog">All Gear</Link></li>
          <li><Link to={`/catalog?category=${encodeURIComponent(category)}`}>{category}</Link></li>
          <li aria-current="page">{name}</li>
        </ol>
      </nav>

      <div className={styles.top}>
        {/* ---------- Галерея ---------- */}
        <div className={styles.gallery}>
          {imageUrl
            ? <img src={assetUrl(imageUrl)} alt={name} className={styles.mainImage} />
            : <span className={`icon ${styles.noImage}`} aria-hidden="true">image</span>}
          {discountPercent > 0 && <span className={styles.badge}>-{discountPercent}%</span>}
          {/* "Серце" на фото — як у макеті: зберегти товар у "Збережене" */}
          <button
            type="button"
            className={styles.favorite}
            aria-pressed={isFavourite}
            aria-label={isFavourite ? `Remove ${name} from saved` : `Save ${name}`}
            onClick={() => favourites.toggle(product).catch(() => {})}
          >
            <span className={`icon ${isFavourite ? styles.favoriteOn : ''}`} aria-hidden="true">favorite</span>
          </button>
        </div>

        {/* ---------- Інформація та покупка ---------- */}
        <div className={styles.info}>
          <div>
            <p className={styles.category}>{categoryLabel(category)}</p>
            <h1 className={styles.title}>{name}</h1>
            {rating != null && (
              <p className={styles.rating}>
                <span className="icon" aria-hidden="true">star</span>
                {Number(rating).toFixed(1)} ({reviewCount} reviews)
              </p>
            )}
          </div>

          <div className={styles.priceRow}>
            <p className={styles.price}>{formatPrice(price)}</p>
            <p className={!inStock ? styles.outOfStock : lowStock ? styles.lowStock : styles.inStock}>
              <span className={styles.dot} aria-hidden="true" />
              {!inStock ? 'Out of stock' : lowStock ? `Only ${stock} left` : 'In stock · ships in 1–2 days'}
            </p>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.block}>
            <p className={styles.label}>Compatible with:</p>
            <ul className={styles.chips}>
              {ALL_PLATFORMS.map((platform) => {
                const ok = product.compatibility?.includes(platform)
                return (
                  <li key={platform} className={ok ? styles.chip : `${styles.chip} ${styles.chipOff}`}>
                    <span className="icon" aria-hidden="true">{ok ? 'check' : 'close'}</span>
                    {platform}
                    <span className="visually-hidden">{ok ? ' — compatible' : ' — not compatible'}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          {colors.length > 0 && (
            // Вибір кольору — група радіокнопок: стрілками ←/→ можна перемикати з клавіатури
            <fieldset className={styles.block}>
              <legend className={styles.label}>Color: <strong>{colorName(color)}</strong></legend>
              <div className={styles.swatches}>
                {colors.map((hex) => (
                  <label key={hex} className={styles.swatch} style={{ '--swatch': hex }}>
                    <input
                      type="radio"
                      name="color"
                      value={hex}
                      checked={color === hex}
                      onChange={() => setColor(hex)}
                      className="visually-hidden"
                    />
                    <span className="visually-hidden">{colorName(hex)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className={styles.block}>
            <p className={styles.label}>Quantity:</p>
            <QuantityCounter value={quantity} onChange={setQuantity} max={maxQuantity} label={`Quantity of ${name}`} />
          </div>

          <div className={styles.buy}>
            <Button icon="shopping_cart" onClick={handleAddToCart} disabled={!inStock || status.type === 'loading'} className={styles.addButton}>
              {inStock ? 'Add to cart' : 'Out of stock'}
            </Button>
            {/* role="status"/"alert" — скрінрідер озвучить результат додавання */}
            {status.type === 'error' && <p role="alert" className={styles.error}>{status.message}</p>}
            {status.type === 'success' && <p role="status" className="visually-hidden">{status.message}</p>}
            <ul className={styles.perks}>
              <li><span className="icon" aria-hidden="true">home</span>Free delivery</li>
              <li><span className="icon" aria-hidden="true">autorenew</span>30-day returns</li>
              <li><span className="icon" aria-hidden="true">verified_user</span>2-year warranty</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Мобільна панель покупки, що "прилипає" до низу екрана (макет Product Page Mobile) */}
      {/* aria-hidden: це дубль основної кнопки для зручності на телефоні — скрінрідер його пропускає */}
      <div className={styles.stickyBar} aria-hidden="true">
        <div>
          <p className={styles.stickyName}>{name}</p>
          <p className={styles.stickyPrice}>{formatPrice(price)}</p>
        </div>
        <Button icon="shopping_cart" onClick={handleAddToCart} disabled={!inStock || status.type === 'loading'} tabIndex={-1}>
          {inStock ? 'Add to cart' : 'Out of stock'}
        </Button>
      </div>

      {/* ---------- Опис і характеристики ---------- */}
      <section className={styles.details} aria-labelledby="details-title">
        <div className={styles.about}>
          <h2 id="details-title">Designed for performance.</h2>
          <p>{product.longDescription}</p>
        </div>
        {specs.length > 0 && (
          <dl className={styles.specs}>
            {specs.map(([label, value]) => (
              <div key={label} className={styles.specRow}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* ---------- Часто купують разом ---------- */}
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <h2 id="related-title">Frequently Bought Together</h2>
          <ul className={styles.relatedGrid}>
            {related.slice(0, 4).map((item) => <li key={item.id}><ProductCard product={item} /></li>)}
          </ul>
        </section>
      )}
    </div>
  )
}
