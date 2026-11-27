import { useEffect, useRef, useState } from 'react'
import styles from './Form.module.css'

// Випадаючий список (місто, відділення, перевізник у профілі) — оформлений як у макетах "Dropdown City / Branch".
// Стандартний <select> не дає оформити список варіантів (браузер малює його сам), тому список власний.
// a11y: шаблон WAI-ARIA "listbox": кнопка (підписана <label htmlFor>) з aria-haspopup / aria-expanded відкриває
// список role="listbox"; ↑/↓ — рух, Home / End — перший / останній, Enter / пробіл — вибір, Esc — закрити.
// API як у звичайного поля: value, onChange(event) з event.target.value, onBlur, error, required, disabled.
// На телефоні (макет "Branch Select Mobile") список відкривається шторкою знизу: ручка, назва поля, хрестик і —
// якщо задано searchPlaceholder — поле пошуку, що фільтрує варіанти. На десктопі шторки не видно.
export default function SelectField({ id, name, label, error, required = false, options, placeholder = 'Select…', value, onChange, onBlur, disabled = false, searchPlaceholder = '' }) {
  const errorId = `${id}-error`
  const listId = `${id}-list`
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0) // підсвічений стрілками варіант
  const [query, setQuery] = useState('') // текст пошуку у шторці (лише телефон)
  const selectedIndex = options.indexOf(value)
  // Індекси варіантів, що відповідають пошуку (без пошуку — усі)
  const needle = query.trim().toLowerCase()
  const visible = options.map((_, index) => index).filter((index) => !needle || options[index].toLowerCase().includes(needle))

  function openList() {
    if (disabled || options.length === 0) return
    setActive(Math.max(selectedIndex, 0))
    setQuery('')
    setOpen(true)
  }

  function close({ focusButton = true } = {}) {
    setOpen(false)
    onBlur?.() // поле "відвідане" — після цього форма показує помилку, якщо значення не вибране
    if (focusButton) buttonRef.current?.focus()
  }

  function choose(index) {
    // Віддаємо батьку об'єкт, схожий на подію change, — тож bind() / onChange(e => e.target.value) працюють як раніше
    onChange?.({ target: { name, value: options[index] } })
    close()
  }

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  // Активний варіант завжди видно, навіть у довгому списку з прокруткою
  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  useEffect(() => {
    if (!open) return
    const onDown = (event) => { if (!wrapRef.current?.contains(event.target)) close({ focusButton: false }) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  })

  function handleButtonKeyDown(event) {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      openList()
    }
  }

  function handleListKeyDown(event) {
    // Рух по варіантах, що лишилися після пошуку (без пошуку — по всіх)
    const pos = visible.indexOf(active)
    const last = visible.length - 1
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(visible[Math.min(pos + 1, last)] ?? active) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(visible[Math.max(pos - 1, 0)] ?? active) }
    else if (event.key === 'Home') { event.preventDefault(); setActive(visible[0] ?? active) }
    else if (event.key === 'End') { event.preventDefault(); setActive(visible[last] ?? active) }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (visible.includes(active)) choose(active) }
    else if (event.key === 'Escape') { event.preventDefault(); close() }
    else if (event.key === 'Tab') close({ focusButton: false })
  }

  function handleSearchChange(event) {
    const next = event.target.value
    setQuery(next)
    const text = next.trim().toLowerCase()
    setActive(options.findIndex((option) => !text || option.toLowerCase().includes(text)))
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'Enter') { event.preventDefault(); if (visible.includes(active)) choose(active) }
    else if (event.key === 'Escape') { event.preventDefault(); close() }
    else if (event.key === 'ArrowDown') { event.preventDefault(); listRef.current?.focus() }
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <div className={styles.selectWrap} ref={wrapRef}>
        <button
          id={id}
          ref={buttonRef}
          type="button"
          name={name}
          className={`${styles.input} ${styles.select} ${open ? styles.selectOpen : ''} ${error ? styles.invalid : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          onClick={() => (open ? close() : openList())}
          onKeyDown={handleButtonKeyDown}
        >
          <span className={value ? styles.selectValue : styles.selectPlaceholder}>{value || placeholder}</span>
        </button>
        <span className={`icon ${styles.chevron}`} aria-hidden="true">{open ? 'expand_less' : 'expand_more'}</span>

        {open && (
          <>
          {/* Телефон: затемнення + шторка знизу (ручка, назва, хрестик, пошук). На десктопі цих елементів не видно */}
          <div className={styles.sheetBackdrop} aria-hidden="true" onClick={() => close()} />
          <div className={styles.sheet}>
          <div className={styles.sheetHead}>
            <span className={styles.sheetHandle} aria-hidden="true" />
            <div className={styles.sheetRow}>
              <p className={styles.sheetTitle}>{label}</p>
              <button type="button" className={styles.sheetClose} aria-label={`Close ${label}`} onClick={() => close()}>
                <span className="icon" aria-hidden="true">close</span>
              </button>
            </div>
          </div>
          {searchPlaceholder && (
            <label className={styles.sheetSearch}>
              <span className="icon" aria-hidden="true">search</span>
              <span className="visually-hidden">{searchPlaceholder}</span>
              <input type="search" value={query} placeholder={searchPlaceholder} autoComplete="off" onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} />
            </label>
          )}
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-label={label}
            aria-activedescendant={visible.includes(active) ? `${id}-option-${active}` : undefined}
            className={styles.dropdown}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => {
              if (!visible.includes(index)) return null
              const selected = index === selectedIndex
              return (
                <li
                  key={option}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={selected}
                  className={`${styles.dropdownOption} ${selected ? styles.dropdownSelected : ''} ${index === active ? styles.dropdownActive : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span className={styles.dropdownText}>{option}</span>
                  {selected && <span className={`icon ${styles.dropdownTick}`} aria-hidden="true">check</span>}
                </li>
              )
            })}
            {visible.length === 0 && <li role="presentation" className={styles.sheetEmpty}>No matches</li>}
          </ul>
          </div>
          </>
        )}
      </div>
      {error && <p id={errorId} className={styles.error}><span className="icon" aria-hidden="true">error</span>{error}</p>}
    </div>
  )
}
