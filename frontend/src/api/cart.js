import { apiRequest } from './client.js'

// Кошик гостя бекенд впізнає за заголовком X-Cart-Id.
// Ідентифікатор генеруємо один раз і зберігаємо в localStorage — кошик не зникає після перезавантаження.
const CART_ID_KEY = 'gaminglab-cart-id'

export function getCartId() {
  let id = null
  try { id = localStorage.getItem(CART_ID_KEY) } catch { /* localStorage недоступний */ }
  if (!id) {
    id = crypto.randomUUID()
    try { localStorage.setItem(CART_ID_KEY, id) } catch { /* працюємо без збереження */ }
  }
  return id
}

const cartHeaders = () => ({ 'X-Cart-Id': getCartId() })

export const fetchCart = () => apiRequest('/api/cart', { headers: cartHeaders() })

export const addCartItem = (productId, quantity = 1, color = null) =>
  apiRequest('/api/cart/items', { method: 'POST', headers: cartHeaders(), body: { productId, quantity, color } })

export const updateCartItem = (itemId, quantity) =>
  apiRequest(`/api/cart/items/${itemId}`, { method: 'PATCH', headers: cartHeaders(), body: { quantity } })

export const removeCartItem = (itemId) =>
  apiRequest(`/api/cart/items/${itemId}`, { method: 'DELETE', headers: cartHeaders() })
