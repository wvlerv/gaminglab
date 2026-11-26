import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import AddedToast from '../cart/AddedToast.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

// Спільний каркас усіх сторінок.
// Семантичні теги (header / main / footer) — вимога a11y із завдання.
export default function Layout() {
  // Кількість товарів і відкриття кошика беремо з глобального стану (CartContext)
  const { count, openCart } = useCart()
  const { user } = useAuth()

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <Header cartCount={count} onCartClick={openCart} user={user} />

      {/* Outlet — місце, куди React Router підставляє поточну сторінку */}
      {/* tabIndex={-1}: "Skip to content" переводить фокус саме в main, а не лише прокручує сторінку */}
      <main id="main" tabIndex={-1}>
        {/* Suspense тут, а не навколо всього застосунку: поки вантажиться сторінка, шапка і футер лишаються на місці */}
        <Suspense fallback={<p className="container" style={{ padding: '64px 0' }} role="status">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />

      {/* Кошик і повідомлення — поверх будь-якої сторінки */}
      <CartDrawer />
      <AddedToast />
    </>
  )
}
