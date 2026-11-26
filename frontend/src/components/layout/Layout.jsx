import { Outlet } from 'react-router'
import Header from './Header.jsx'

// Спільний каркас усіх сторінок.
// Семантичні теги (header / main / footer) — вимога a11y із завдання.
export default function Layout() {
  // Тимчасово: кошик ще не підключений. Пізніше число прийде з CartContext.
  const cartCount = 0

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <Header cartCount={cartCount} onCartClick={() => {}} />

      {/* Outlet — місце, куди React Router підставляє поточну сторінку */}
      <main id="main">
        <Outlet />
      </main>

      <footer className="container" style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>
        © 2026 GamingLab. All rights reserved.
      </footer>
    </>
  )
}
