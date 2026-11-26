import { Outlet, Link } from 'react-router'

// Спільний каркас усіх сторінок.
// Семантичні теги (header / nav / main / footer) — вимога a11y із завдання.
export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header>
        <nav aria-label="Main" className="container" style={{ display: 'flex', gap: 24, height: 'var(--header-height)', alignItems: 'center' }}>
          <Link to="/">GamingLab</Link>
          <Link to="/catalog/pc">PC</Link>
          <Link to="/catalog/console">Console</Link>
          <Link to="/catalog/accessories">Accessories</Link>
        </nav>
      </header>

      {/* Outlet — місце, куди React Router підставляє поточну сторінку */}
      <main id="main">
        <Outlet />
      </main>

      <footer className="container" style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>
        © GamingLab
      </footer>
    </>
  )
}
