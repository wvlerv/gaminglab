import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

// BrowserRouter "слухає" адресний рядок і дає маршрутизацію всьому застосунку
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Провайдер робить кошик доступним усім компонентам усередині */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
