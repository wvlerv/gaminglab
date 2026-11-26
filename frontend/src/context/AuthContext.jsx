import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getToken, setToken, clearToken } from '../api/client.js'
import * as authApi from '../api/auth.js'
import { useCart } from './CartContext.jsx'

// ГЛОБАЛЬНИЙ СТАН авторизації: хто увійшов. Потрібен шапці (аватар), "Збереженому", кабінету, оформленню.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { refreshCart } = useCart()
  const [user, setUser] = useState(null)              // { id, firstName, lastName, email, ... } або null
  const [checking, setChecking] = useState(Boolean(getToken())) // перевіряємо збережений токен під час запуску

  // Якщо токен збережено з минулого візиту — перевіряємо, чи він ще дійсний (запит профілю)
  useEffect(() => {
    if (!getToken()) return
    authApi.getProfile()
      .then(setUser)
      .catch(() => {
        // токен прострочений — вважаємо користувача гостем і перезавантажуємо кошик уже як гість
        clearToken()
        refreshCart().catch(() => {})
      })
      .finally(() => setChecking(false))
  }, [refreshCart])

  // Будь-який запит отримав 401 із простроченим токеном (див. api/client.js) — виходимо локально
  useEffect(() => {
    const onExpired = () => { setUser(null); refreshCart().catch(() => {}) }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [refreshCart])

  // Після входу/реєстрації: зберігаємо токен, переносимо кошик гостя в акаунт, оновлюємо кошик
  const startSession = useCallback(async ({ accessToken, user: account }, remember) => {
    setToken(accessToken, remember)
    setUser(account)
    try { await authApi.mergeGuestCart() } catch { /* кошик гостя порожній — нічого переносити */ }
    await refreshCart().catch(() => {})
  }, [refreshCart])

  const login = useCallback(async (email, password, remember) => {
    const data = await authApi.login({ email, password, rememberMe: remember })
    await startSession(data, remember)
    return data.user
  }, [startSession])

  const signup = useCallback(async (form) => {
    const data = await authApi.signup(form)
    await startSession(data, false)
    return data.user
  }, [startSession])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* навіть якщо сервер недоступний — виходимо локально */ }
    clearToken()
    setUser(null)
    await refreshCart().catch(() => {}) // тепер знову кошик гостя
  }, [refreshCart])

  const value = useMemo(() => ({ user, checking, isLoggedIn: Boolean(user), login, signup, logout, setUser }),
    [user, checking, login, signup, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
