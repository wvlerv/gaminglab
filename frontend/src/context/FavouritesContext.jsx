import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { getFavourites, addFavourite, removeFavourite, clearFavourites } from '../api/favourites.js'
import { useAuth } from './AuthContext.jsx'

// ГЛОБАЛЬНИЙ СТАН "Збереженого": "серце" на будь-якій картці має знати, чи збережено товар.
const FavouritesContext = createContext(null)
const EMPTY = { items: [], totalValue: 0, availableCount: 0 }

export function FavouritesProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loaded, setLoaded] = useState(EMPTY)
  // Гість завжди бачить порожній список; користувач — те, що завантажили з сервера
  const data = isLoggedIn ? loaded : EMPTY

  const reload = useCallback(async () => {
    if (isLoggedIn) setLoaded(await getFavourites())
  }, [isLoggedIn])

  // Користувач увійшов — завантажуємо його "Збережене" (setState — у колбеку після відповіді сервера)
  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    getFavourites().then((result) => { if (!cancelled) setLoaded(result) }).catch(() => {})
    return () => { cancelled = true }
  }, [isLoggedIn])

  const ids = useMemo(() => new Set(data.items.map((item) => item.productId)), [data])

  // Клік по "серцю": гостя ведемо на вхід (і після входу повернемо назад), користувачу — додаємо/видаляємо
  const toggle = useCallback(async (product) => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname + location.search, reason: 'favourites' } })
      return
    }
    if (ids.has(product.id)) await removeFavourite(product.id)
    else await addFavourite(product.id)
    await reload()
  }, [isLoggedIn, ids, navigate, location, reload])

  const remove = useCallback(async (productId) => { await removeFavourite(productId); await reload() }, [reload])
  const clear = useCallback(async () => { await clearFavourites(); await reload() }, [reload])

  const value = useMemo(() => ({ ...data, ids, isFavourite: (id) => ids.has(id), toggle, remove, clear, reload }),
    [data, ids, toggle, remove, clear, reload])

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavourites() {
  const context = useContext(FavouritesContext)
  if (!context) throw new Error('useFavourites must be used inside <FavouritesProvider>')
  return context
}
