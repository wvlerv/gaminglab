import { useEffect, useRef, useState } from 'react'
import styles from './Form.module.css'

// Випадаючий список (місто, відділення, перевізник у профілі) — оформлений як у макетах "Dropdown City / Branch".
// Стандартний <select> не дає оформити список варіантів (браузер малює його сам), тому список власний.
// a11y: шаблон WAI-ARIA "listbox": кнопка (підписана <label htmlFor>) з aria-haspopup / aria-expanded відкриває
// список role="listbox"; ↑/↓ — рух, Home / End — перший / останній, Enter / пробіл — вибір, Esc — закрити.
// API як у звичайного поля: value, onChange(event) з event.target.value, onBlur, error, required, disabled.
export default function SelectField({ id, name, label, error, required = false, options, placeholder = 'Select…', value, onChange, onBlur, disabled = false }) {
  const errorId = `${id}-error`
  const listId = `${id}-list`
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0) // підсвічений стрілками варіант
  const selectedIndex = options.indexOf(value)

  function openList() {
    if (disabled || options.length === 0) return
    setActive(Math.max(selectedIndex, 0))
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
    const last = options.length - 1
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, last)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (event.key === 'Home') { event.preventDefault(); setActive(0) }
    else if (event.key === 'End') { event.preventDefault(); setActive(last) }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(active) }
    else if (event.key === 'Escape') { event.preventDefault(); close() }
    else if (event.key === 'Tab') close({ focusButton: false })
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
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-label={label}
            aria-activedescendant={`${id}-option-${active}`}
            className={styles.dropdown}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => {
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
          </ul>
        )}
      </div>
      {error && <p id={errorId} className={styles.error}><span className="icon" aria-hidden="true">error</span>{error}</p>}
    </div>
  )
}
