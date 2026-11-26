// Адреса бекенду. Локально порожня (працює проксі з vite.config.js),
// на продакшені задається змінною оточення VITE_API_URL (наприклад, https://gaminglab-api.onrender.com).
export const API_URL = import.meta.env.VITE_API_URL ?? ''

// Єдина функція для всіх запитів до API: додає заголовки, перевіряє помилки, розбирає JSON.
export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    // Бекенд повертає опис помилки в JSON — намагаємось його прочитати
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      message = data.message || data.error || message
    } catch {
      /* відповідь без JSON — залишаємо загальне повідомлення */
    }
    throw new Error(message)
  }

  // 204 No Content — тіла відповіді немає
  if (response.status === 204) return null
  return response.json()
}

// Картинки товарів зберігаються на бекенді: /images/products/...
export function assetUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}
