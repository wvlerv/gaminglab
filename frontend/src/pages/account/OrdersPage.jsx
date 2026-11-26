import { useEffect, useState } from 'react'
import AccountLayout from '../../components/account/AccountLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { getMyOrders } from '../../api/orders.js'
import { assetUrl } from '../../api/client.js'
import { formatPrice } from '../../utils/format.js'
import { STATUS_INFO, canCancel, CARRIER_LABELS, METHOD_LABELS, PAYMENT_LABELS, formatDate, itemsCount } from '../../utils/orders.js'
import { useOrderActions } from './useOrderActions.js'
import styles from './Account.module.css'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(null)
  const [tab, setTab] = useState('all') // локальний стан: обрана вкладка-фільтр
  const replaceOrder = (updated) => setOrders((list) => list.map((o) => (o.orderNumber === updated.orderNumber ? updated : o)))
  const actions = useOrderActions(replaceOrder)

  useEffect(() => { getMyOrders().then(setOrders).catch(() => setOrders([])) }, [])

  const count = (value) => (orders ?? []).filter((o) => value === 'all' || STATUS_INFO[o.status]?.group === value).length
  const visible = (orders ?? []).filter((o) => tab === 'all' || STATUS_INFO[o.status]?.group === tab)

  return (
    <AccountLayout crumbs={[{ to: '/account', label: 'Account' }, { label: 'My orders' }]} title="My orders" subtitle="Track deliveries, view order details and buy again.">
      {/* Фільтри — група кнопок-перемикачів: aria-pressed повідомляє скрінрідеру, який фільтр увімкнено */}
      <div role="group" aria-label="Filter orders" className={styles.tabs}>
        {TABS.map((t) => (
          <button key={t.value} type="button" aria-pressed={tab === t.value} className={styles.tab} onClick={() => setTab(t.value)}>
            {t.label} <span className={styles.tabCount}>{count(t.value)}</span>
          </button>
        ))}
      </div>

      {actions.error && <p role="alert" className={styles.error}>{actions.error}</p>}
      {!orders && <p className={styles.muted}>Loading orders…</p>}
      {orders && visible.length === 0 && (
        <div className={`${styles.card} ${styles.empty}`}>
          <h2 className={styles.cardTitle}>No orders here yet</h2>
          <p className={styles.cardText}>When you place an order while logged in, it will appear in this list.</p>
          <Button to="/catalog">Explore gear</Button>
        </div>
      )}

      {visible.map((order) => {
        const status = STATUS_INFO[order.status] ?? { label: order.status, tone: 'warning' }
        return (
          <article key={order.orderNumber} className={styles.card} aria-labelledby={`order-${order.orderNumber}`}>
            <div className={styles.orderHead}>
              <div>
                <h2 id={`order-${order.orderNumber}`} className={styles.orderNumber}>Order #{order.orderNumber}</h2>
                <p className={styles.orderMeta}>Placed on {formatDate(order.createdAt)} · {itemsCount(order)} {itemsCount(order) === 1 ? 'item' : 'items'}</p>
              </div>
              <span className={`${styles.status} ${styles[status.tone]}`}>{status.label}</span>
            </div>

            <div className={styles.thumbs}>
              {order.items.slice(0, 4).map((item) => (
                <span key={`${item.productId}-${item.color}`} className={styles.thumb}>
                  {item.imageUrl && <img src={assetUrl(item.imageUrl)} alt="" />}
                </span>
              ))}
              <span className={styles.thumbNames}>{order.items.map((i) => i.name).join(', ')}</span>
            </div>

            <div className={styles.orderFoot}>
              <div>
                <p className={styles.orderMeta}>{CARRIER_LABELS[order.carrier]} · {METHOD_LABELS[order.deliveryMethod]} · {PAYMENT_LABELS[order.paymentMethod]}</p>
                <p className={styles.orderTotal}>{formatPrice(order.total)}</p>
              </div>
              <div className={styles.orderButtons}>
                <Button variant="secondary" to={`/account/orders/${order.orderNumber}`} aria-label={`View details of order ${order.orderNumber}`}>View details</Button>
                {canCancel(order.status) && <Button variant="dangerOutline" onClick={() => actions.askCancel(order)}>Cancel order</Button>}
                {status.group === 'delivered' && <Button onClick={() => actions.buyAgain(order)}>Buy again</Button>}
              </div>
            </div>
          </article>
        )
      })}

      <ConfirmDialog
        open={Boolean(actions.toCancel)}
        title={`Cancel order #${actions.toCancel?.orderNumber ?? ''}?`}
        text={actions.toCancel?.paymentMethod === 'PAY_ON_DELIVERY'
          ? 'The order hasn’t been shipped yet, so we can cancel it right away. You won’t be charged — payment was due on delivery.'
          : 'The order hasn’t been shipped yet, so we can cancel it right away. The payment will be refunded to your card.'}
        cancelLabel="Keep order"
        confirmLabel="Cancel order"
        busy={actions.busy}
        onConfirm={actions.confirmCancel}
        onCancel={actions.closeCancel}
      />
    </AccountLayout>
  )
}
