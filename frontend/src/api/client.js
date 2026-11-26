// Адреса бекенду. Локально порожня (працює проксі з vite.config.js),
// на продакшені задається змінною оточення VITE_API_URL (наприклад, https://gaminglab-api.onrender.com).
export const API_URL = import.meta.env.VITE_API_URL ?? ''

// ---------- Токен входу (JWT) ----------
// "Remember me" -> localStorage (зберігається після закриття браузера), інакше sessionStorage (до закриття вкладки).
const TOKEN_KEY = 'gaminglab-token'
export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) } catch { return null }
}
export function setToken(token, remember) {
  try {
    clearToken()
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
  } catch { /* сховище недоступне */ }
}
export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

// Помилка API з HTTP-статусом: компонент може показати своє, зрозуміле повідомлення (напр. для 401 чи 400)
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Єдина функція для всіх запитів до API: додає заголовки (JSON, токен), перевіряє помилки, розбирає JSON.
export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken()
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not connect to the server. Please check your connection and try again.', 0)
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      // Spring за замовчуванням повертає лише "Bad Request" в полі error; детальне message — якщо увімкнено на бекенді
      message = data.message || data.error || message
    } catch {
      /* відповідь без JSON — залишаємо загальне повідомлення */
    }
    // Токен був, але сервер відповів 401 — сесія прострочена: прибираємо токен і повідомляємо застосунок
    if (response.status === 401 && token) {
      clearToken()
      window.dispatchEvent(new Event('auth:expired'))
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return null
  return response.json()
}

// Картинки товарів зберігаються на бекенді: /images/products/...
export function assetUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}
