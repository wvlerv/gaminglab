import { apiRequest } from './client.js'

// Усі запити, пов'язані з товарами, — в одному місці (ендпоінти бекенду /api/products)
export const getNewArrivals = () => apiRequest('/api/products/new')
export const getPopular = () => apiRequest('/api/products/popular')
export const getProduct = (id) => apiRequest(`/api/products/${id}`)
export const getFilters = () => apiRequest('/api/products/filters')
export const getSuggestions = (q) => apiRequest(`/api/products/suggestions?q=${encodeURIComponent(q)}`)

// params — об'єкт фільтрів, напр. { q: 'mouse', brand: ['Razer'], sort: 'price-asc' }
export function getProducts(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) value.forEach((v) => search.append(key, v))
    else search.append(key, value)
  })
  return apiRequest(`/api/products?${search}`)
}
