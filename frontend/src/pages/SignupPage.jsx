import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import TextField from '../components/form/TextField.jsx'
import PasswordField from '../components/form/PasswordField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { rules } from '../utils/validation.js'
import formStyles from '../components/form/Form.module.css'
import styles from './AuthPages.module.css'

// Ті самі обмеження, що й на бекенді (Dtos.SignupRequest): пароль 8–72 символи, обов'язкова згода з умовами
function validate(form) {
  const errors = {
    firstName: form.firstName.trim() ? '' : 'Please enter your first name.',
    lastName: form.lastName.trim() ? '' : 'Please enter your last name.',
    email: form.email.trim() ? rules.email(form.email) : 'Please enter your email address.',
    password: form.password.length >= 8 ? '' : 'Password must be at least 8 characters.',
    acceptedTerms: form.acceptedTerms ? '' : 'Please accept the Terms of Use and Privacy Policy.',
  }
  return Object.fromEntries(Object.entries(errors).filter(([, m]) => m))
}

export default function SignupPage() {
  const { signup, isLoggedIn } = useAuth()
  const location = useLocation()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', acceptedTerms: false })
  const [submitted, setSubmitted] = useState(false)
  const [serverErrors, setServerErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [created, setCreated] = useState(null) // створений акаунт -> екран "You're in"

  const errors = { ...(submitted ? validate(form) : {}), ...serverErrors }
  // Уже увійшли і не щойно зареєструвались — форма реєстрації не потрібна
  const alreadyLoggedIn = isLoggedIn && !created && !sending
  const set = (field) => (event) => {
    setForm({ ...form, [field]: field === 'acceptedTerms' ? event.target.checked : event.target.value })
    if (serverErrors[field]) setServerErrors({}) // користувач виправляє — прибираємо помилку сервера
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    const found = validate(form)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    setSending(true)
    try {
      const user = await signup({ ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() })
      setCreated(user)
    } catch (err) {
      // 409 Conflict — бекенд повідомляє, що такий email уже зареєстрований
      const emailTaken = err.status === 409
      setServerErrors(emailTaken ? { email: err.message || 'An account with this email already exists. Try logging in.' } : { form: err.message })
      if (emailTaken) document.getElementById('email')?.focus()
    } finally {
      setSending(false)
    }
  }

  if (alreadyLoggedIn) return <Navigate to="/account" replace />

  const caption = { title: 'Join the squad.', text: 'Get early access to drops, keep your wishlist in sync and check out in seconds.' }

  if (created) {
    return (
      <AuthLayout {...caption}>
        <div className={styles.success}>
          <span className={styles.successIcon} aria-hidden="true"><span className="icon">check</span></span>
          <h1 className={styles.title}>You’re in, {created.firstName}!</h1>
          <p className={styles.subtitle}>Your GamingLab account is ready. We’ve sent a confirmation to {created.email}.</p>
          <Button to={location.state?.from || '/catalog'} className={styles.submit}>Start shopping</Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout {...caption}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>It takes less than a minute. No spam, only gear.</p>
        </div>
        {errors.form && <p role="alert" className={formStyles.formError}><span className="icon" aria-hidden="true">error</span>{errors.form}</p>}

        <div className={styles.twoCols}>
          <TextField id="firstName" label="First name" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
          <TextField id="lastName" label="Last name" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
        </div>
        <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
        <PasswordField id="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" hint="Use at least 8 characters." value={form.password} onChange={set('password')} error={errors.password} />

        <div>
          <label className={formStyles.checkbox}>
            <input
              id="acceptedTerms"
              type="checkbox"
              checked={form.acceptedTerms}
              onChange={set('acceptedTerms')}
              aria-invalid={Boolean(errors.acceptedTerms)}
              aria-describedby={errors.acceptedTerms ? 'acceptedTerms-error' : undefined}
            />
            <span>I agree to the <Link to="/info/terms">Terms of Use</Link> and <Link to="/info/privacy">Privacy Policy</Link></span>
          </label>
          {errors.acceptedTerms && <p id="acceptedTerms-error" className={formStyles.error}><span className="icon" aria-hidden="true">error</span>{errors.acceptedTerms}</p>}
        </div>

        <Button type="submit" disabled={sending} className={styles.submit}>{sending ? 'Creating account…' : 'Create account'}</Button>
        <p className={styles.switch}>Already have an account? <Link to="/login" state={location.state} className={styles.link}>Log in</Link></p>
      </form>
    </AuthLayout>
  )
}
