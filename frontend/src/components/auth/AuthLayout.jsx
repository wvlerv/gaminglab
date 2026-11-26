import styles from './AuthLayout.module.css'

// Спільний каркас сторінок входу й реєстрації: фото з підписом ліворуч, форма праворуч.
// Пропси: eyebrow / title / text — підпис на фото (різний для Login і Sign Up); children — форма.
export default function AuthLayout({ title, text, children }) {
  return (
    <div className={`container ${styles.page}`}>
      {/* Фото декоративне (alt=""), а підпис — справжній текст, а не частина картинки */}
      <div className={styles.visual}>
        <img src="/images/auth/setup.jpg" alt="" className={styles.photo} />
        <div className={styles.caption}>
          <p className={styles.eyebrow}>Better gear. Brighter wins.</p>
          <p className={styles.visualTitle}>{title}</p>
          <p className={styles.visualText}>{text}</p>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
