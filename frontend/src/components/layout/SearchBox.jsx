import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSuggestions, getProducts } from '../../api/products.js'
import { assetUrl } from '../../api/client.js'
import { formatPrice, categoryLabel } from '../../utils/format.js'
import styles from './SearchBox.module.css'

// Пошук з підказками (макет "Homepage Search Suggestions").
// a11y: шаблон combobox (WAI-ARIA) — поле role="combobox" керує списком role="listbox";
// стрілки ↑/↓ рухаються по варіантах, Enter відкриває, Esc закриває; aria-activedescendant
// повідомляє скрінрідеру, який варіант зараз активний, хоча фокус лишається в полі.
export default function SearchBox({ onNavigate }) {
  const navigate = useNavigate()
  const listId = useId()
  const wrapRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [results, setResults] = useState({ q: '', suggestions: [], products: [], total: 0 })

  // Запит до бекенду не на кожну літеру, а через 250 мс після паузи у введенні (debounce)
  useEffect(() => {
    const text = query.trim()
    if (text.length < 2) return
    const timer = setTimeout(() => {
      Promise.all([getSuggestions(text), getProducts({ q: text, size: 3 })])
        .then(([suggestions, page]) => setResults({
          q: text,
          suggestions: suggestions.slice(0, 3),
          products: page.content ?? [],
          total: page.totalElements ?? page.page?.totalElements ?? 0,
        }))
        .catch(() => {})
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  // Закриваємо підказки при кліку поза пошуком
  useEffect(() => {
    const close = (event) => { if (!wrapRef.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const text = query.trim()
  const fresh = results.q === text && text.length >= 2
  // Усі варіанти одним списком — для навігації стрілками
  const options = fresh ? [
    ...results.suggestions.map((s) => ({ type: 'suggestion', label: s, go: `/catalog?search=${encodeURIComponent(s)}` })),
    ...results.products.map((p) => ({ type: 'product', product: p, go: `/product/${p.id}` })),
    { type: 'all', go: `/catalog?search=${encodeURIComponent(text)}` },
  ] : []
  const showList = open && fresh

  function go(path) {
    navigate(path)
    setOpen(false)
    setActive(-1)
    onNavigate?.()
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, options.length - 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, -1)) }
    else if (event.key === 'Escape') { setOpen(false); setActive(-1) }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (showList && active >= 0) go(options[active].go)
    else if (text) go(`/catalog?search=${encodeURIComponent(text)}`)
  }

  const optionId = (index) => `${listId}-option-${index}`
  // Частину назви, що збігається із запитом, підсвічуємо (як "wireless mouse" у макеті)
  const highlight = (label) => {
    const i = label.toLowerCase().indexOf(text.toLowerCase())
    if (i < 0) return label
    return <>{label.slice(0, i)}<span className={styles.match}>{label.slice(i, i + text.length)}</span>{label.slice(i + text.length)}</>
  }

  // Індекс варіанта в загальному списку options: спершу підказки, потім товари, потім "See all"
  const productOffset = results.suggestions.length
  const allIndex = productOffset + results.products.length
  return (
    <div className={styles.wrap} ref={wrapRef}>
      <form role="search" className={`${styles.search} ${showList ? styles.searchOpen : ''}`} onSubmit={handleSubmit}>
        <label htmlFor={`${listId}-input`} className="visually-hidden">Search products</label>
        <span className={`icon ${styles.searchIcon}`} aria-hidden="true">search</span>
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          placeholder="Search for gear, brands ..."
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      </form>

      {showList && (
        <div className={styles.panel}>
          <ul id={listId} role="listbox" aria-label="Search suggestions" className={styles.list}>
            {results.suggestions.length > 0 && <li role="presentation" className={styles.group}>Suggestions</li>}
            {results.suggestions.map((s, i) => {
              return (
                <li key={`s-${s}`} id={optionId(i)} role="option" aria-selected={active === i}
                  className={`${styles.option} ${active === i ? styles.active : ''}`}
                  onMouseEnter={() => setActive(i)} onClick={() => go(options[i].go)}>
                  <span className={`icon ${styles.optionIcon}`} aria-hidden="true">search</span>{highlight(s)}
                </li>
              )
            })}

            {results.products.length > 0 && <li role="presentation" className={styles.group}>Products</li>}
            {results.products.map((p, n) => {
              const i = productOffset + n
              return (
                <li key={`p-${p.id}`} id={optionId(i)} role="option" aria-selected={active === i}
                  className={`${styles.option} ${styles.product} ${active === i ? styles.active : ''}`}
                  onMouseEnter={() => setActive(i)} onClick={() => go(options[i].go)}>
                  <span className={styles.thumb}>{p.imageUrl && <img src={assetUrl(p.imageUrl)} alt="" />}</span>
                  <span className={styles.productInfo}>
                    <span className={styles.productCategory}>{categoryLabel(p.category)}</span>
                    <span>{p.name}</span>
                  </span>
                  <span className={styles.price}>{formatPrice(p.price)}</span>
                </li>
              )
            })}

            <li id={optionId(allIndex)} role="option" aria-selected={active === allIndex}
              className={`${styles.option} ${styles.all} ${active === allIndex ? styles.active : ''}`}
              onMouseEnter={() => setActive(allIndex)} onClick={() => go(options[allIndex].go)}>
              {results.total > 0 ? `See all ${results.total} results for “${text}”` : `No products found for “${text}”`}
              <span className="icon" aria-hidden="true">arrow_forward</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
