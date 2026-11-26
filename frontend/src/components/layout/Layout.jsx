import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

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

      <Footer />
    </>
  )
}
