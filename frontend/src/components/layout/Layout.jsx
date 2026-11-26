import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import { useCart } from '../../context/CartContext.jsx'

// Спільний каркас усіх сторінок.
// Семантичні теги (header / main / footer) — вимога a11y із завдання.
export default function Layout() {
  // Кількість товарів і відкриття кошика беремо з глобального стану (CartContext)
  const { count, openCart } = useCart()

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to content</a>

      <Header cartCount={count} onCartClick={openCart} />

      {/* Outlet — місце, куди React Router підставляє поточну сторінку */}
      <main id="main">
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
