import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import RequireAuth from './components/account/RequireAuth.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'

// Розділення коду (code splitting): кожна сторінка — окремий файл, який браузер завантажує,
// лише коли користувач на неї переходить. Головна — одразу, бо з неї зазвичай починають.
const CatalogPage = lazy(() => import('./pages/CatalogPage.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'))
const SavedPage = lazy(() => import('./pages/SavedPage.jsx'))
const ProfilePage = lazy(() => import('./pages/account/ProfilePage.jsx'))
const OrdersPage = lazy(() => import('./pages/account/OrdersPage.jsx'))
const OrderDetailsPage = lazy(() => import('./pages/account/OrderDetailsPage.jsx'))
const InfoPage = lazy(() => import('./pages/InfoPage.jsx'))

// Карта маршрутів: яка адреса -> яка сторінка.
// Layout — спільна "рамка" (шапка + футер), сторінки підставляються всередину.
export default function App() {
  return (
    <>
    {/* Прокрутка вгору при переході — для всіх сторінок, включно з оформленням */}
    <ScrollToTop />
    {/* Поки завантажується файл сторінки — показуємо коротке повідомлення */}
    <Suspense fallback={<p className="container" style={{ padding: '64px 0' }} role="status">Loading…</p>}>
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
        <Route path="info/:slug" element={<InfoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Оформлення замовлення — без основної шапки й футера (спрощений макет Checkout) */}
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="checkout/success" element={<OrderSuccessPage />} />
    </Routes>
    </Suspense>
    </>
  )
}
