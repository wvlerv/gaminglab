import { useCallback, useEffect, useState } from 'react'
import AccountLayout from '../../components/account/AccountLayout.jsx'
import TextField from '../../components/form/TextField.jsx'
import SelectField from '../../components/form/SelectField.jsx'
import Button from '../../components/ui/Button.jsx'
import Toast from '../../components/ui/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getProfile, updateProfile, updateDeliveryPreferences, changePassword } from '../../api/auth.js'
import { CARRIERS, CITIES, DELIVERY_METHODS, getDeliveryPoints } from '../../data/delivery.js'
import { rules, formatPhone } from '../../utils/validation.js'
import styles from './Account.module.css'

const carrierLabel = (value) => CARRIERS.find((c) => c.value === value)?.label ?? ''

export default function ProfilePage() {
  const { setUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  useEffect(() => { getProfile().then(setProfile).catch(() => {}) }, [])

  return (
    <AccountLayout crumbs={[{ label: 'Account' }]} title="My account" subtitle="Manage your personal details, delivery preferences and orders.">
      <Toast message={toast} onClose={closeToast} />
      {!profile ? <p className={styles.muted}>Loading…</p> : (
        <>
          <PersonalForm profile={profile} onSaved={(p) => { setProfile(p); setUser((u) => ({ ...u, firstName: p.firstName, lastName: p.lastName })); setToast({ title: 'Changes saved', text: 'Your personal information has been updated.' }) }} />
          <DeliveryForm profile={profile} onSaved={(p) => { setProfile(p); setToast({ title: 'Preferences saved', text: 'We’ll prefill checkout with these details.' }) }} />
          <PasswordForm onSaved={() => setToast({ title: 'Password changed', text: 'Use your new password next time you log in.' })} />
        </>
      )}
    </AccountLayout>
  )
}

// ---------- Personal information ----------
function PersonalForm({ profile, onSaved }) {
  const initial = { firstName: profile.firstName ?? '', lastName: profile.lastName ?? '', phone: profile.phone ?? '' }
  const [form, setForm] = useState(initial)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const errors = submitted ? Object.fromEntries(Object.entries({
    firstName: form.firstName.trim() ? '' : 'Please enter your first name.',
    lastName: form.lastName.trim() ? '' : 'Please enter your last name.',
    phone: form.phone.trim() ? rules.phone(form.phone) : '',
  }).filter(([, m]) => m)) : {}
  const changed = JSON.stringify(form) !== JSON.stringify(initial)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (!form.firstName.trim() || !form.lastName.trim() || (form.phone.trim() && rules.phone(form.phone))) return
    try {
      onSaved(await updateProfile({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), phone: form.phone.trim() || null }))
      setSubmitted(false)
    } catch (err) { setError(err.message) }
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate aria-labelledby="personal-title">
      <div className={styles.cardHead}>
        <h2 id="personal-title" className={styles.cardTitle}>Personal information</h2>
        <p className={styles.cardText}>Your email is your login and can’t be changed here.</p>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        <TextField id="firstName" label="First name" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} error={errors.firstName} />
        <TextField id="lastName" label="Last name" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} error={errors.lastName} />
        <div className={styles.lockedWrap}>
          <TextField id="accountEmail" label="Email" value={profile.email} readOnly aria-readonly="true" className={styles.locked} />
          <span className={`icon ${styles.lock}`} aria-hidden="true">lock</span>
        </div>
        <TextField id="profilePhone" label="Phone" type="tel" autoComplete="tel" placeholder="+380 67 123 45 67" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} error={errors.phone} />
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => { setForm(initial); setSubmitted(false) }} disabled={!changed}>Cancel</Button>
        <Button type="submit" disabled={!changed}>Save changes</Button>
      </div>
    </form>
  )
}

// ---------- Delivery preferences ----------
function DeliveryForm({ profile, onSaved }) {
  const [form, setForm] = useState({
    carrier: profile.preferredCarrier ?? '',
    city: profile.preferredCity ?? '',
    deliveryMethod: profile.preferredDeliveryMethod ?? '',
    deliveryPoint: profile.preferredDeliveryPoint ?? '',
  })
  const [error, setError] = useState('')
  const methods = DELIVERY_METHODS[form.carrier] ?? []
  const points = getDeliveryPoints(form.carrier, form.city, form.deliveryMethod)

  function change(field, value) {
    const next = { ...form, [field]: value }
    if (field === 'carrier') { next.deliveryMethod = ''; next.deliveryPoint = '' }
    if (field === 'city' || field === 'deliveryMethod') next.deliveryPoint = ''
    setForm(next)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      onSaved(await updateDeliveryPreferences({
        carrier: form.carrier || null, city: form.city || null,
        deliveryMethod: form.deliveryMethod || null, deliveryPoint: form.deliveryPoint || null,
      }))
    } catch (err) { setError(err.message) }
  }

  // Селекти очікують підписи, а зберігаємо коди (NOVA_POSHTA) — перетворюємо в обидва боки
  const methodLabel = methods.find((m) => m.value === form.deliveryMethod)?.label ?? ''
  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-labelledby="delivery-pref-title">
      <div className={styles.cardHead}>
        <h2 id="delivery-pref-title" className={styles.cardTitle}>Delivery preferences</h2>
        <p className={styles.cardText}>We’ll prefill checkout with these details.</p>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        <SelectField id="prefCarrier" label="Carrier" options={CARRIERS.map((c) => c.label)} value={carrierLabel(form.carrier)}
          onChange={(e) => change('carrier', CARRIERS.find((c) => c.label === e.target.value)?.value ?? '')} />
        <SelectField id="prefCity" label="City" options={CITIES} value={form.city} onChange={(e) => change('city', e.target.value)} />
        <SelectField id="prefMethod" label="Delivery method" options={methods.map((m) => m.label)} value={methodLabel} disabled={!form.carrier}
          onChange={(e) => change('deliveryMethod', methods.find((m) => m.label === e.target.value)?.value ?? '')} />
        {form.deliveryMethod !== 'COURIER' && (
          <SelectField id="prefPoint" label="Branch" options={points} value={form.deliveryPoint} disabled={!points.length}
            onChange={(e) => change('deliveryPoint', e.target.value)} />
        )}
      </div>
      <div className={styles.actions}>
        <Button type="submit">Save preferences</Button>
      </div>
    </form>
  )
}

// ---------- Password ----------
function PasswordForm({ onSaved }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const errors = submitted ? Object.fromEntries(Object.entries({
    currentPassword: form.currentPassword ? '' : 'Please enter your current password.',
    newPassword: form.newPassword.length >= 8 && /\d/.test(form.newPassword) ? '' : 'Use at least 8 characters with a number.',
  }).filter(([, m]) => m)) : {}

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setServerError('')
    if (!form.currentPassword || form.newPassword.length < 8 || !/\d/.test(form.newPassword)) return
    try {
      await changePassword(form)
      setForm({ currentPassword: '', newPassword: '' })
      setSubmitted(false)
      onSaved()
    } catch (err) {
      // 400 від бекенду: неправильний поточний пароль або новий збігається зі старим
      setServerError(err.status === 400 ? 'Current password is incorrect, or the new password is the same as the old one.' : err.message)
    }
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate aria-labelledby="password-title">
      <div className={styles.cardHead}>
        <h2 id="password-title" className={styles.cardTitle}>Password</h2>
        <p className={styles.cardText}>Use at least 8 characters with a number.</p>
      </div>
      {serverError && <p role="alert" className={styles.error}>{serverError}</p>}
      <div className={styles.grid}>
        <TextField type="password" id="currentPassword" label="Current password" autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} error={errors.currentPassword} />
        <TextField type="password" id="newPassword" label="New password" autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} error={errors.newPassword} />
      </div>
      <div className={styles.actions}>
        <Button type="submit" variant="secondary">Change password</Button>
      </div>
    </form>
  )
}
