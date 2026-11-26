import { useState } from 'react'
import { useNavigate } from 'react-router'
import { cancelOrder } from '../../api/orders.js'
import { useCart } from '../../context/CartContext.jsx'

// Дії із замовленням, спільні для списку і сторінки деталей: скасування (з підтвердженням) і "Buy again"
export function useOrderActions(onChanged) {
  const { addItem, openCart } = useCart()
  const navigate = useNavigate()
  const [toCancel, setToCancel] = useState(null) // замовлення, для якого відкрите вікно підтвердження
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function confirmCancel() {
    setBusy(true)
    try {
      const updated = await cancelOrder(toCancel.orderNumber)
      setToCancel(null)
      onChanged?.(updated)
    } catch (err) {
      setError(err.message)
      setToCancel(null)
    } finally {
      setBusy(false)
    }
  }

  // Повторне замовлення: додаємо ті самі товари (з тими самими кольорами) у кошик і відкриваємо його
  async function buyAgain(order) {
    setError('')
    try {
      for (const item of order.items) {
        await addItem({ id: item.productId, name: item.name }, item.quantity, item.color)
      }
      openCart()
    } catch (err) {
      setError(`Some items could not be added: ${err.message}`)
    }
  }

  return { toCancel, askCancel: setToCancel, closeCancel: () => setToCancel(null), confirmCancel, busy, buyAgain, error, navigate }
}
