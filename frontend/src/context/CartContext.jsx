import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCart, addCartItem, updateCartItem, removeCartItem } from '../api/cart.js'

// ГЛОБАЛЬНИЙ СТАН кошика.
// Кошик потрібен у різних частинах дерева компонентів: лічильник у шапці, картки товарів,
// сторінка товару, бічна панель кошика, оформлення замовлення. Тому зберігаємо його в Context,
// а не передаємо пропсами через усі рівні.
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)        // відповідь бекенду: { cartId, items, subtotal, itemCount }
  const [isOpen, setIsOpen] = useState(false)   // відкрита бічна панель кошика чи ні
  const [lastAdded, setLastAdded] = useState(null) // для повідомлення "Added to cart"

  // Під час запуску застосунку завантажуємо кошик із сервера (синхронізація з бекендом)
  useEffect(() => {
    fetchCart().then(setCart).catch(() => setCart({ items: [], subtotal: 0, itemCount: 0 }))
  }, [])

  // Кожна дія йде на бекенд, а у відповідь приходить оновлений кошик — джерело правди на сервері
  const addItem = useCallback(async (product, quantity = 1, color = null) => {
    const updated = await addCartItem(product.id, quantity, color)
    setCart(updated)
    setLastAdded({ product, quantity, at: Date.now() })
    return updated
  }, [])

  const updateItem = useCallback(async (itemId, quantity) => {
    setCart(await updateCartItem(itemId, quantity))
  }, [])

  const removeItem = useCallback(async (itemId) => {
    setCart(await removeCartItem(itemId))
  }, [])

  // Відкриваючи кошик, ховаємо повідомлення "Added to cart" — панель і так показує товар
  // Після оформлення замовлення бекенд очищає кошик — завантажуємо новий (порожній)
  const refreshCart = useCallback(async () => { setCart(await fetchCart()) }, [])

  const openCart = useCallback(() => { setIsOpen(true); setLastAdded(null) }, [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const clearLastAdded = useCallback(() => setLastAdded(null), [])

  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  // useMemo — об'єкт значення не створюється заново на кожен рендер без потреби
  const value = useMemo(() => ({
    cart,
    count,
    addItem,
    updateItem,
    removeItem,
    isOpen,
    openCart,
    closeCart,
    lastAdded,
    clearLastAdded,
    refreshCart,
  }), [cart, count, addItem, updateItem, removeItem, isOpen, openCart, closeCart, lastAdded, clearLastAdded, refreshCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Власний хук: будь-який компонент пише const { count, addItem } = useCart()
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
