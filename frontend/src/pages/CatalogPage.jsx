import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import ProductCard from '../components/product/ProductCard.jsx'
import FilterGroup from '../components/catalog/FilterGroup.jsx'
import SearchNoResults from '../components/catalog/SearchNoResults.jsx'
import SortDropdown from '../components/catalog/SortDropdown.jsx'
import Button from '../components/ui/Button.jsx'
import { useApi } from '../hooks/useApi.js'
import { getFilters, getProducts } from '../api/products.js'
import styles from './CatalogPage.module.css'

// Розділи меню -> фільтри бекенду (рішення команди: PC/Console — за платформою, Accessories — за категорією)
const SECTIONS = {
  pc: { title: 'PC Gear', fixed: { platform: ['PC'] } },
  console: { title: 'Console Gear', fixed: { platform: ['PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch'] } },
  accessories: { title: 'Accessories', fixed: { category: ['Accessories'] } },
}

const PRICE_RANGES = [
  { value: '0-2000', label: 'Under 2 000 UAH', min: undefined, max: 2000 },
  { value: '2000-4000', label: '2 000 – 4 000 UAH', min: 2000, max: 4000 },
  { value: '4000-6000', label: '4 000 – 6 000 UAH', min: 4000, max: 6000 },
  { value: '6000-8000', label: '6 000 – 8 000 UAH', min: 6000, max: 8000 },
  { value: '8000+', label: 'Over 8 000 UAH', min: 8000, max: undefined },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const PAGE_SIZE = 12
const MULTI_KEYS = ['category', 'brand', 'platform', 'feature']
// Підписи у фільтрі як у макеті (на бекенді категорія називається "Mouse", у макеті — "Mice")
const OPTION_LABELS = { Mouse: 'Mice' }
const toOptions = (values = []) => values.map((value) => ({ value, label: OPTION_LABELS[value] ?? value }))

export default function CatalogPage() {
  const { section } = useParams() // /catalog/:section -> 'pc' | 'console' | 'accessories'
  const current = SECTIONS[section]

  // Стан фільтрів зберігається в адресі сторінки (?brand=Razer&sort=price-asc).
  // Тому посилання з фільтрами можна скопіювати, а кнопка "Назад" повертає попередні фільтри.
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false) // локальний стан: панель фільтрів на мобільних
  const backRef = useRef(null)

  // a11y: відкрили фільтри на мобільному — переводимо фокус у панель; Esc — закриває її
  useEffect(() => {
    if (!filtersOpen) return
    backRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') setFiltersOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [filtersOpen])
  const [limit, setLimit] = useState(PAGE_SIZE)

  // Перейшли в інший розділ (PC -> Console) — компонент той самий, тож скидаємо "Show more" і панель фільтрів
  const [lastSection, setLastSection] = useState(section)
  if (lastSection !== section) {
    setLastSection(section)
    setLimit(PAGE_SIZE)
    setFiltersOpen(false)
  }

  const selected = Object.fromEntries(MULTI_KEYS.map((key) => [key, searchParams.getAll(key)]))
  const price = searchParams.get('price')
  const sort = searchParams.get('sort') || 'popular'
  const search = searchParams.get('search') || ''

  // Запит до бекенду = фіксовані фільтри розділу + те, що обрав користувач
  const range = PRICE_RANGES.find((r) => r.value === price)
  const query = {
    q: search,
    category: current?.fixed.category ?? selected.category,
    brand: selected.brand,
    platform: current?.fixed.platform ?? selected.platform,
    feature: selected.feature,
    minPrice: range?.min,
    maxPrice: range?.max,
    sort,
    size: limit,
  }

  const { data: page, loading, error } = useApi(() => getProducts(query), [query])
  const { data: filters } = useApi(getFilters, [])

  function updateParams(change) {
    const next = new URLSearchParams(searchParams)
    change(next)
    setSearchParams(next)
    setLimit(PAGE_SIZE) // нові фільтри — знову перша "сторінка"
  }

  function toggleValue(key, value) {
    updateParams((next) => {
      const values = next.getAll(key)
      next.delete(key)
      const updated = values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
      updated.forEach((v) => next.append(key, v))
    })
  }

  const setPrice = (value) => updateParams((next) => (price === value ? next.delete('price') : next.set('price', value)))
  const setSort = (value) => updateParams((next) => next.set('sort', value))
  const clearAll = () => updateParams((next) => {
    [...MULTI_KEYS, 'price'].forEach((key) => next.delete(key))
  })

  // "Таблетки" активних фільтрів над сіткою товарів
  const pills = [
    ...MULTI_KEYS.flatMap((key) => selected[key].map((value) => ({ key, value, label: OPTION_LABELS[value] ?? value }))),
    ...(range ? [{ key: 'price', value: range.value, label: range.label }] : []),
  ]
  const removePill = (pill) => (pill.key === 'price' ? setPrice(pill.value) : toggleValue(pill.key, pill.value))

  const products = page?.content ?? []
  // Spring повертає сторінку як { content, totalElements } або { content, page: { totalElements } }
  const total = page?.totalElements ?? page?.page?.totalElements ?? 0
  const title = search ? `Results for “${search}”` : current?.title ?? 'All Gear'

  // Пошук нічого не знайшов (і фільтри не звужували результат) — окрема сторінка з макету "Search No Results"
  if (search && !loading && !error && total === 0 && pills.length === 0) {
    return <SearchNoResults query={search} />
  }

  return (
    <div className={`container ${styles.page}`}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        {/* Для пошуку в "хлібних крихтах" — просто "Search", а запит видно в заголовку сторінки */}
        <Link to="/">Home</Link> / <span aria-current="page">{search ? 'Search' : title}</span>
      </nav>

      {/* Пошук: кількість під заголовком (макет Search Results Mobile); каталог — поруч із заголовком */}
      <div className={`${styles.heading} ${search ? styles.headingStacked : ''}`}>
        <h1 className={styles.title}>{title}</h1>
        {/* aria-live — скрінрідер повідомить нову кількість після зміни фільтрів */}
        <p className={styles.count} aria-live="polite">{loading ? 'Loading…' : `${total} ${total === 1 ? 'product' : 'products'}`}</p>
      </div>

      <div className={styles.layout}>
        <aside className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ''}`} aria-label="Filters">
          <div className={styles.filtersHead}>
            <h2 className={styles.filtersTitle}>
              {/* На мобільних заголовок панелі — кнопка "назад" (макет Catalog Filters Mobile) */}
              <button type="button" ref={backRef} className={styles.filtersBack} onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <span className="icon" aria-hidden="true">arrow_back</span>
              </button>
              Filters
            </h2>
            {pills.length > 0 && <Button variant="link" className={styles.clearAll} onClick={clearAll}>Clear All</Button>}
          </div>
          {!current?.fixed.category && (
            <FilterGroup title="Category" options={toOptions(filters?.categories)} selected={selected.category} onToggle={(v) => toggleValue('category', v)} />
          )}
          <FilterGroup title="Brand" options={toOptions(filters?.brands)} selected={selected.brand} onToggle={(v) => toggleValue('brand', v)} />
          {!current?.fixed.platform && (
            <FilterGroup title="Platform" options={toOptions(filters?.platforms)} selected={selected.platform} onToggle={(v) => toggleValue('platform', v)} />
          )}
          <FilterGroup title="Features" limit={5} options={toOptions(filters?.features)} selected={selected.feature} onToggle={(v) => toggleValue('feature', v)} />
          <FilterGroup title="Price" type="radio" options={PRICE_RANGES} selected={price ? [price] : []} onToggle={setPrice} />
          <div className={styles.filtersFooter}>
            <Button onClick={() => setFiltersOpen(false)} style={{ width: '100%' }}>
              {loading ? 'Loading…' : `Show ${total} ${total === 1 ? 'product' : 'products'}`}
            </Button>
          </div>
        </aside>

        <section className={styles.results} aria-label="Products">
          <div className={styles.toolbar}>
            <button
              type="button"
              className={`${styles.pill} ${styles.filtersButton}`}
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <span className="icon" aria-hidden="true">tune</span> Filters{pills.length > 0 && ` (${pills.length})`}
            </button>

            <ul className={styles.pills} aria-label="Applied filters">
              {pills.map((pill) => (
                <li key={`${pill.key}-${pill.value}`}>
                  <button type="button" className={styles.pill} onClick={() => removePill(pill)} aria-label={`Remove filter ${pill.label}`}>
                    {pill.label} <span className="icon" aria-hidden="true">close</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Власний список замість <select> — щоб варіанти виглядали як у макеті "Dropdown sorting" */}
            <SortDropdown options={SORT_OPTIONS} value={sort} onChange={setSort} className={`${styles.pill} ${styles.sortPill}`} />
          </div>

          {error && <p role="alert" className={styles.message}>Could not load products. Please try again later.</p>}

          {!loading && !error && products.length === 0 && (
            <div className={styles.empty}>
              <span className="icon" aria-hidden="true">search_off</span>
              <h2>No products found</h2>
              <p>Try changing the filters or the search request.</p>
              {pills.length > 0 ? <Button onClick={clearAll}>Clear all filters</Button> : <Button to="/catalog">View all products</Button>}
            </div>
          )}

          {products.length > 0 && (
            <ul className={styles.grid} aria-busy={loading}>
              {products.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
            </ul>
          )}

          {products.length < total && (
            <Button variant="secondary" className={styles.more} onClick={() => setLimit((value) => value + PAGE_SIZE)}>
              See More
            </Button>
          )}
        </section>
      </div>
    </div>
  )
}
