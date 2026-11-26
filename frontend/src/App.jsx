import { Routes, Route } from 'react-router'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Карта маршрутів: яка адреса -> яка сторінка.
// Layout — спільна "рамка" (шапка + футер), сторінки підставляються всередину.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:section" element={<CatalogPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
