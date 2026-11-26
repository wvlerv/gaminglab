// Статуси бекенду (OrderStatus) -> підпис і колір бейджа в кабінеті
export const STATUS_INFO = {
  CREATED: { label: 'Processing', tone: 'warning', group: 'active' },
  CONFIRMED: { label: 'Processing', tone: 'warning', group: 'active' },
  PAID: { label: 'Processing', tone: 'warning', group: 'active' },
  PROCESSING: { label: 'Processing', tone: 'warning', group: 'active' },
  SHIPPED: { label: 'Shipped', tone: 'accent', group: 'active' },
  DELIVERED: { label: 'Delivered', tone: 'success', group: 'delivered' },
  CANCELLED: { label: 'Cancelled', tone: 'danger', group: 'cancelled' },
  PAYMENT_FAILED: { label: 'Payment failed', tone: 'danger', group: 'cancelled' },
}

// Крок у трекері "Placed -> Confirmed -> Shipped -> Delivered"
export const STATUS_STEP = { CREATED: 0, CONFIRMED: 1, PAID: 1, PROCESSING: 1, SHIPPED: 2, DELIVERED: 3 }

// Скасувати можна, поки замовлення не передане перевізнику (те саме правило, що й на бекенді)
export const canCancel = (status) => !['SHIPPED', 'DELIVERED', 'CANCELLED', 'PAYMENT_FAILED'].includes(status)

export const CARRIER_LABELS = { NOVA_POSHTA: 'Nova Poshta', UKRPOSHTA: 'Ukrposhta' }
export const METHOD_LABELS = { BRANCH: 'Branch', PARCEL_LOCKER: 'Parcel locker', COURIER: 'Courier', PICKUP: 'Pickup' }
export const PAYMENT_LABELS = { CARD_ONLINE: 'Card online', PAY_ON_DELIVERY: 'Pay on delivery' }

// "2026-11-15T12:32:00Z" -> "15 Nov 2026"
export function formatDate(iso, withTime = false) {
  if (!iso) return ''
  const date = new Date(iso)
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: withTime ? undefined : 'numeric' })
  return withTime ? `${day}, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : day
}

export const itemsCount = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
