import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import AccountLayout from '../../components/account/AccountLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { getOrder } from '../../api/orders.js'
import { assetUrl } from '../../api/client.js'
import { formatPrice } from '../../utils/format.js'
import { colorName } from '../../utils/colors.js'
import { STATUS_INFO, STATUS_STEP, canCancel, CARRIER_LABELS, METHOD_LABELS, PAYMENT_LABELS, formatDate, itemsCount } from '../../utils/orders.js'
import { useOrderActions } from './useOrderActions.js'
import styles from './Account.module.css'

const STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered']

export default function OrderDetailsPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const actions = useOrderActions(setOrder)

  useEffect(() => { getOrder(orderNumber).then(setOrder).catch(() => setNotFound(true)) }, [orderNumber])

  const crumbs = [{ to: '/account', label: 'Account' }, { to: '/account/orders', label: 'My orders' }, { label: `#${orderNumber}` }]
  if (notFound) {
    return (
      <AccountLayout crumbs={crumbs} title="Order not found">
        <div className={styles.card}><p>We couldn’t find order #{orderNumber}.</p><Button to="/account/orders">Back to orders</Button></div>
      </AccountLayout>
    )
  }
  if (!order) return <AccountLayout crumbs={crumbs} title={`Order #${orderNumber}`}><p className={styles.muted}>Loading…</p></AccountLayout>

  const status = STATUS_INFO[order.status] ?? { label: order.status, tone: 'warning' }
  const step = STATUS_STEP[order.status] ?? -1
  const cancelled = status.group === 'cancelled'

  const summary = (
    <section className={styles.card} aria-labelledby="summary-title">
      <h2 id="summary-title" className={styles.cardTitle}>Summary</h2>
      <dl className={styles.info + ' ' + styles.summary}>
        <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
        <div><dt>Shipping</dt><dd>{Number(order.shippingCost) ? formatPrice(order.shippingCost) : 'Free'}</dd></div>
        <div className={styles.summaryTotal}><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
      </dl>
      {canCancel(order.status) && (
        <>
          <Button variant="dangerOutline" onClick={() => actions.askCancel(order)}>Cancel order</Button>
          <p className={styles.note}>You can cancel until the order is handed to the carrier.</p>
        </>
      )}
      {status.group === 'delivered' && <Button onClick={() => actions.buyAgain(order)}>Buy again</Button>}
      <p className={styles.help}>Need help? <Link to="/info/contact">Contact support</Link></p>
    </section>
  )

  return (
    <AccountLayout
      crumbs={crumbs}
      titleExtra={<Link to="/account/orders" className={styles.back}><span className="icon" aria-hidden="true">arrow_back</span>Back to orders</Link>}
      title={<>Order #{order.orderNumber} <span className={`${styles.status} ${styles[status.tone]}`}>{status.label}</span></>}
      subtitle={`Placed on ${formatDate(order.createdAt)} · ${itemsCount(order)} ${itemsCount(order) === 1 ? 'item' : 'items'}`}
      aside={summary}
    >
      {actions.error && <p role="alert" className={styles.error}>{actions.error}</p>}

      <section className={styles.card} aria-labelledby="status-title">
        <h2 id="status-title" className={styles.cardTitle}>Order status</h2>
        {cancelled ? (
          <p className={styles.danger}>This order was cancelled.</p>
        ) : (
          // Трекер — впорядкований список; aria-current="step" позначає поточний етап для скрінрідера
          <ol className={styles.steps}>
            {STEPS.map((label, index) => (
              <li
                key={label}
                className={`${styles.step} ${index <= step ? styles.stepDone : ''} ${index === step ? styles.stepCurrent : ''}`}
                aria-current={index === step ? 'step' : undefined}
              >
                <span className={styles.stepLabel}>{label}</span>
                <span>{index === 0 ? formatDate(order.createdAt, true) : index === step ? 'In progress' : index < step ? 'Done' : '—'}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.card} aria-labelledby="items-title">
        <h2 id="items-title" className={styles.cardTitle}>Items</h2>
        {order.items.map((item) => (
          <div key={`${item.productId}-${item.color}`} className={styles.itemRow}>
            <span className={`${styles.thumb} ${styles.itemThumb}`}>{item.imageUrl && <img src={assetUrl(item.imageUrl)} alt="" />}</span>
            <div>
              <Link to={`/product/${item.productId}`} className={styles.itemName}>{item.name}</Link>
              <p className={styles.itemMeta}>{item.color && <>Color: {colorName(item.color)} · </>}Quantity: {item.quantity}</p>
            </div>
            <span className={styles.itemPrice}>{formatPrice(item.lineTotal)}</span>
          </div>
        ))}
      </section>

      <section className={styles.card} aria-labelledby="delivery-title">
        <h2 id="delivery-title" className={styles.cardTitle}>Delivery &amp; payment</h2>
        <dl className={styles.info}>
          <div><dt>Carrier</dt><dd>{CARRIER_LABELS[order.carrier]} · {METHOD_LABELS[order.deliveryMethod]}</dd></div>
          <div><dt>Address</dt><dd>{order.deliveryPoint || '—'}</dd></div>
          <div><dt>Payment</dt><dd>{PAYMENT_LABELS[order.paymentMethod]}</dd></div>
        </dl>
      </section>

      <ConfirmDialog
        open={Boolean(actions.toCancel)}
        title={`Cancel order #${order.orderNumber}?`}
        text={order.paymentMethod === 'PAY_ON_DELIVERY'
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
