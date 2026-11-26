import { apiRequest } from './client.js'

// "Збережене" доступне лише після входу (бекенд вимагає токен)
export const getFavourites = () => apiRequest('/api/favourites')
export const addFavourite = (productId) => apiRequest(`/api/favourites/products/${productId}`, { method: 'POST' })
export const removeFavourite = (productId) => apiRequest(`/api/favourites/products/${productId}`, { method: 'DELETE' })
export const clearFavourites = () => apiRequest('/api/favourites', { method: 'DELETE' })
