import { apiRequest } from './client.js'
import { getCartId } from './cart.js'

// Оформлення замовлення: бекенд бере товари з кошика (за X-Cart-Id) і повертає створене замовлення
export const placeOrder = (data) =>
  apiRequest('/api/orders/checkout', { method: 'POST', headers: { 'X-Cart-Id': getCartId() }, body: data })

export const getOrder = (orderNumber) => apiRequest(`/api/orders/${orderNumber}`)

// Замовлення користувача (кабінет). Фільтр Active / Delivered / Cancelled робимо на фронтенді
export const getMyOrders = () => apiRequest("/api/orders/my")
export const cancelOrder = (orderNumber) => apiRequest(`/api/orders/${orderNumber}/cancel`, { method: 'POST' })
