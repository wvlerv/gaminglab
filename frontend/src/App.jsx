import { Routes, Route } from 'react-router'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ProfilePage from './pages/account/ProfilePage.jsx'
import OrdersPage from './pages/account/OrdersPage.jsx'
import OrderDetailsPage from './pages/account/OrderDetailsPage.jsx'
import RequireAuth from './components/account/RequireAuth.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'

// Карта маршрутів: яка адреса -> яка сторінка.
// Layout — спільна "рамка" (шапка + футер), сторінки підставляються всередину.
export default function App() {
  return (
    <>
    {/* Прокрутка вгору при переході — для всіх сторінок, включно з оформленням */}
    <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:section" element={<CatalogPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="saved" element={<SavedPage />} />
        {/* Кабінет — лише для тих, хто увійшов */}
        <Route path="account" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="account/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
        <Route path="account/orders/:orderNumber" element={<RequireAuth><OrderDetailsPage /></RequireAuth>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Оформлення замовлення — без основної шапки й футера (спрощений макет Checkout) */}
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="checkout/success" element={<OrderSuccessPage />} />
    </Routes>
    </>
  )
}
