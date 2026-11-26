import { apiRequest } from './client.js'
import { getCartId } from './cart.js'

export const signup = (data) => apiRequest('/api/auth/signup', { method: 'POST', body: data })
export const login = (data) => apiRequest('/api/auth/login', { method: 'POST', body: data })
export const logout = () => apiRequest('/api/auth/logout', { method: 'POST' })

// Після входу переносимо товари з кошика гостя в кошик акаунта
export const mergeGuestCart = () => apiRequest('/api/cart/merge', { method: 'POST', headers: { 'X-Cart-Id': getCartId() } })

export const getProfile = () => apiRequest('/api/account/profile')
export const updateProfile = (data) => apiRequest('/api/account/profile', { method: 'PUT', body: data })
export const updateDeliveryPreferences = (data) => apiRequest('/api/account/delivery-preferences', { method: 'PUT', body: data })
export const changePassword = (data) => apiRequest('/api/account/password', { method: 'PUT', body: data })
