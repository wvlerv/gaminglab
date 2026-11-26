import { useState } from 'react'
import { Link } from 'react-router'
import ProductCard from '../components/product/ProductCard.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useApi } from '../hooks/useApi.js'
import { getProducts } from '../api/products.js'
import { formatPrice } from '../utils/format.js'
import styles from './SavedPage.module.css'

// "Збережене" (у PRD — розділ для складання сетапу з товарів різних брендів).
export default function SavedPage() {
  const { isLoggedIn, checking } = useAuth()
  const { items, totalValue } = useFavourites()
  const { addItem, openCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  // Бекенд "Збереженого" не повертає опис і "New", тому беремо повні дані товарів з каталогу
  const { data: catalog } = useApi(() => getProducts({ size: 100 }), [])
  const full = new Map((catalog?.content ?? []).map((p) => [p.id, p]))
  const products = items.map((item) => full.get(item.productId) ?? { ...item, id: item.productId })
  const available = products.filter((p) => p.inStock && p.stock > 0)

  // "Додати всі доступні в кошик однією кнопкою" — ключова функція з PRD
  async function addAllAvailable() {
    setAdding(true)
    setError('')
    try {
      for (const product of available) await addItem(product, 1, product.colors?.[0] ?? null)
      openCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const breadcrumbs = (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <Link to="/">Home</Link> / <span aria-current="page">Favorites</span>
    </nav>
  )

  if (checking) return <div className={`container ${styles.page}`}>{breadcrumbs}<p>Loading…</p></div>

  // Гість: пропонуємо увійти (макет "Favorites Empty State For Unauthorized")
  if (!isLoggedIn) {
    return (
      <div className={`container ${styles.page}`}>
        {breadcrumbs}
        <section className={styles.empty} aria-labelledby="saved-title">
          <span className={styles.emptyIcon} aria-hidden="true"><span className="icon">favorite</span></span>
          <h1 id="saved-title">Save your ultimate setup</h1>
          <p>Log in to save your favorite gear, track price drops, and access your wishlist across all devices.</p>
          <div className={styles.emptyActions}>
            <Button to="/login" state={{ from: '/saved' }}>Log in</Button>
            <Button variant="secondary" to="/signup" state={{ from: '/saved' }}>Create account</Button>
          </div>
        </section>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={`container ${styles.page}`}>
        {breadcrumbs}
        <section className={styles.empty} aria-labelledby="saved-title">
          <span className={styles.emptyIcon} aria-hidden="true"><span className="icon">favorite</span></span>
          <h1 id="saved-title">Nothing saved yet</h1>
          <p>Explore our collection of premium gear and click the heart icon to build your dream setup.</p>
          <Button to="/catalog">Explore gear</Button>
        </section>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      {breadcrumbs}
      <div className={styles.heading}>
        <h1 className={styles.title}>Saved gear</h1>
        <p className={styles.count}>{items.length} {items.length === 1 ? 'product' : 'products'}</p>
      </div>

      <div className={styles.toolbar}>
        <p className={styles.total}>
          Total value <strong>{formatPrice(totalValue)}</strong>
          <span className={styles.stock}><span className={styles.dot} aria-hidden="true" />{available.length} of {items.length} in stock</span>
        </p>
        <div className={styles.actions}>
          <Button icon="shopping_cart" onClick={addAllAvailable} disabled={adding || available.length === 0}>
            {adding ? 'Adding…' : `Add ${available.length} available to cart`}
          </Button>
          <ClearAll />
        </div>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}

      <ul className={styles.grid}>
        {products.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
      </ul>
    </div>
  )
}

// "Clear All" з підтвердженням прямо в кнопці (два кліки) — щоб випадково не втратити весь список
function ClearAll() {
  const { clear } = useFavourites()
  const [confirming, setConfirming] = useState(false)
  return confirming ? (
    <span className={styles.confirm} role="group" aria-label="Confirm clearing saved items">
      <Button variant="link" className={styles.dangerLink} onClick={() => clear().finally(() => setConfirming(false))}>Yes, clear all</Button>
      <Button variant="link" onClick={() => setConfirming(false)}>Keep</Button>
    </span>
  ) : (
    <Button variant="link" onClick={() => setConfirming(true)}>Clear All</Button>
  )
}
