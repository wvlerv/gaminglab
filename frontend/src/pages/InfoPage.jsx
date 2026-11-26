import { Link, NavLink, useParams } from 'react-router'
import NotFoundPage from './NotFoundPage.jsx'
import { INFO_GROUPS, INFO_PAGES, LAST_UPDATED } from '../data/infoPages.js'
import styles from './InfoPage.module.css'

// Один шаблон на 9 інформаційних сторінок: /info/shipping, /info/returns, ... Вміст — з data/infoPages.js
export default function InfoPage() {
  const { slug } = useParams()
  const page = INFO_PAGES[slug]
  if (!page) return <NotFoundPage /> // невідома адреса /info/щось — показуємо 404

  return (
    <div className={`container ${styles.page}`}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/">Home</Link> / <span aria-current="page">{page.nav}</span>
      </nav>

      <div className={styles.layout}>
        <nav aria-label="Information pages" className={styles.sidebar}>
          {INFO_GROUPS.map((group) => (
            <div key={group.title}>
              <p className={styles.groupTitle}>{group.title}</p>
              <ul>
                {group.pages.map((key) => (
                  <li key={key}>
                    <NavLink to={`/info/${key}`} className={({ isActive }) => (isActive ? styles.active : undefined)}>
                      {INFO_PAGES[key].nav}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <article className={styles.content}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.updated}>Last updated: <time dateTime="2026-11-25">{LAST_UPDATED}</time></p>
          <p className={styles.intro}>{page.intro}</p>
          {page.sections.map(([heading, text]) => (
            <section key={heading} className={styles.section}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
