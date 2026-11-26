import { useId, useState } from 'react'
import styles from './FilterGroup.module.css'

// Одна група фільтрів-"акордеон" (Category, Brand, Platform, Features, Price).
// Один компонент на всі групи — різниця лише в пропсах:
//   title — заголовок; options — [{ value, label }]; selected — масив вибраних значень;
//   onToggle(value) — що робити при кліку; type — 'checkbox' (кілька значень) або 'radio' (одне);
//   limit — скільки опцій показувати одразу (решта — за кнопкою "Show all").
export default function FilterGroup({ title, options, selected, onToggle, type = 'checkbox', limit = Infinity }) {
  const [open, setOpen] = useState(true) // локальний стан: розгорнута група чи ні
  const [showAll, setShowAll] = useState(false) // локальний стан: показати всі опції
  const id = useId() // унікальний id для зв'язку кнопки з панеллю (aria-controls)

  if (!options?.length) return null

  // Показуємо перші `limit` опцій + усі вже вибрані (щоб вибране не "ховалось")
  const hiddenCount = Math.max(options.length - limit, 0)
  const visible = showAll ? options : options.filter((option, index) => index < limit || selected.includes(option.value))

  return (
    <div className={styles.group}>
      <h3>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <span className="icon" aria-hidden="true">{open ? 'expand_less' : 'expand_more'}</span>
        </button>
      </h3>

      {/* fieldset + legend — групує поля форми, скрінрідер озвучить "Brand, група" */}
      <fieldset id={id} className={styles.options} hidden={!open}>
        <legend className="visually-hidden">{title}</legend>
        {visible.map((option) => {
          const checked = selected.includes(option.value)
          return (
            <label key={option.value} className={`${styles.option} ${checked ? styles.checked : ''}`}>
              <input
                type={type}
                name={type === 'radio' ? title : undefined}
                checked={checked}
                onChange={() => onToggle(option.value)}
                onClick={(event) => {
                  // радіокнопку можна "зняти" повторним кліком
                  if (type === 'radio' && checked) { event.preventDefault(); onToggle(option.value) }
                }}
              />
              {option.label}
            </label>
          )
        })}
        {hiddenCount > 0 && (
          <button type="button" className={styles.more} aria-expanded={showAll} onClick={() => setShowAll((value) => !value)}>
            {showAll ? 'Show less' : `Show all (${options.length})`}
          </button>
        )}
      </fieldset>
    </div>
  )
}
