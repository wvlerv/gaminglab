import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavouritesProvider } from './context/FavouritesContext.jsx'

// BrowserRouter "слухає" адресний рядок і дає маршрутизацію всьому застосунку
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Провайдери глобального стану: кошик -> авторизація (переносить кошик гостя після входу) -> "Збережене" */}
      <CartProvider>
        <AuthProvider>
          <FavouritesProvider>
            <App />
          </FavouritesProvider>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
