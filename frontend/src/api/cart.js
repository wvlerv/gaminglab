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

// Одночасні запити кошика об'єднуємо в один: інакше під час першого візиту (у режимі розробки React
// викликає ефект двічі) бекенд міг створити ДВА кошики з одним X-Cart-Id, і далі кошик "ламався"
let pendingCart = null
export function fetchCart() {
  pendingCart ??= apiRequest('/api/cart', { headers: cartHeaders() }).finally(() => { pendingCart = null })
  return pendingCart
}

export const addCartItem = (productId, quantity = 1, color = null) =>
  apiRequest('/api/cart/items', { method: 'POST', headers: cartHeaders(), body: { productId, quantity, color } })

export const updateCartItem = (itemId, quantity) =>
  apiRequest(`/api/cart/items/${itemId}`, { method: 'PATCH', headers: cartHeaders(), body: { quantity } })

export const removeCartItem = (itemId) =>
  apiRequest(`/api/cart/items/${itemId}`, { method: 'DELETE', headers: cartHeaders() })
