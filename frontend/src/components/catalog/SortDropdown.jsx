import { useEffect, useId, useRef, useState } from 'react'
import styles from './SortDropdown.module.css'

// Випадаючий список сортування (макет "Dropdown sorting").
// Стандартний <select> не дає оформити список варіантів (браузер малює його сам — блакитне виділення),
// тому список власний. a11y: шаблон WAI-ARIA "listbox" — кнопка з aria-haspopup / aria-expanded відкриває
// список role="listbox"; ↑/↓ — рух по варіантах, Enter / пробіл — вибір, Esc — закрити, Home / End — перший / останній.
// Пропси: options — [{ value, label }], value — обраний варіант, onChange(value) — зміна, className — для "таблетки".
export default function SortDropdown({ options, value, onChange, className = '' }) {
  const listId = useId()
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0) // індекс варіанта, підсвіченого клавіатурою
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  function openList() {
    setActive(selectedIndex)
    setOpen(true)
  }

  function close({ focusButton = true } = {}) {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }

  function choose(index) {
    onChange(options[index].value)
    close()
  }

  // Відкрили список — фокус переходить на нього (активний варіант озвучується через aria-activedescendant)
  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  // Клік поза списком — закриваємо, фокус не чіпаємо (користувач клікнув деінде)
  useEffect(() => {
    if (!open) return
    const onDown = (event) => { if (!wrapRef.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function handleButtonKeyDown(event) {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      openList()
    }
  }

  function handleListKeyDown(event) {
    const last = options.length - 1
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, last)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (event.key === 'Home') { event.preventDefault(); setActive(0) }
    else if (event.key === 'End') { event.preventDefault(); setActive(last) }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(active) }
    else if (event.key === 'Escape') { event.preventDefault(); close() }
    else if (event.key === 'Tab') close({ focusButton: false })
  }

  const optionId = (index) => `${listId}-option-${index}`

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        ref={buttonRef}
        className={`${className} ${styles.trigger}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? close() : openList())}
        onKeyDown={handleButtonKeyDown}
      >
        <span>Sort:</span>
        <span className={styles.current}>{options[selectedIndex]?.label}</span>
        <span className={`icon ${styles.chevron}`} aria-hidden="true">{open ? 'expand_less' : 'expand_more'}</span>
      </button>

      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label="Sort products"
          aria-activedescendant={optionId(active)}
          className={styles.list}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => {
            const selected = index === selectedIndex
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={selected}
                className={`${styles.option} ${selected ? styles.selected : ''} ${index === active ? styles.active : ''}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {option.label}
                {selected && <span className={`icon ${styles.tick}`} aria-hidden="true">check</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
