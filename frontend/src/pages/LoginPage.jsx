import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import TextField from '../components/form/TextField.jsx'
import PasswordField from '../components/form/PasswordField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { rules } from '../utils/validation.js'
import formStyles from '../components/form/Form.module.css'
import styles from './AuthPages.module.css'

function validate({ email, password }) {
  const errors = {
    email: email.trim() ? rules.email(email) : 'Please enter your email address.',
    password: password ? '' : 'Please enter your password.',
  }
  return Object.fromEntries(Object.entries(errors).filter(([, m]) => m))
}

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account' // куди повернути після входу (напр. назад до товару)

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)

  if (isLoggedIn && !sending) return <Navigate to={from} replace /> // уже увійшли — сторінка входу не потрібна

  const errors = submitted ? validate(form) : {}
  const set = (field) => (event) => setForm({ ...form, [field]: field === 'remember' ? event.target.checked : event.target.value })

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setFormError('')
    const found = validate(form)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus() // фокус на перше поле з помилкою
      return
    }
    setSending(true)
    try {
      await login(form.email.trim(), form.password, form.remember)
      navigate(from, { replace: true })
    } catch (err) {
      // 400/401 від бекенду = неправильні дані; 0 = немає з'єднання
      setFormError(err.status === 0 ? err.message : 'Incorrect email or password. Please try again.')
      setSending(false)
    }
  }

  return (
    <AuthLayout title="Your setup, your rules." text="Track orders, keep your wishlist in sync and check out in seconds.">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            {location.state?.reason === 'favourites'
              ? 'Log in to save gear to your favorites.'
              : 'Log in to track your orders, save favorites and check out faster.'}
          </p>
        </div>

        {/* role="alert" — помилку входу скрінрідер озвучить одразу */}
        {formError && <p role="alert" className={formStyles.formError}><span className="icon" aria-hidden="true">error</span>{formError}</p>}

        <div className={styles.fields}>
          <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
          <PasswordField id="password" label="Password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={set('password')} error={errors.password} />

          <div className={styles.row}>
            <label className={formStyles.checkbox}>
              <input type="checkbox" checked={form.remember} onChange={set('remember')} /> Remember me
            </label>
            <Link to="/info/help" className={styles.link}>Forgot password?</Link>
          </div>
        </div>

        <Button type="submit" disabled={sending} className={styles.submit}>{sending ? 'Logging in…' : 'Log in'}</Button>
        <p className={styles.switch}>New to GamingLab? <Link to="/signup" state={location.state} className={styles.link}>Create account</Link></p>
      </form>
    </AuthLayout>
  )
}
