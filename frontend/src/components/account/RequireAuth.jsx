import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext.jsx'

// "Охоронець" маршруту: кабінет доступний лише після входу.
// Гостя перенаправляємо на /login і запам'ятовуємо, куди він хотів потрапити.
export default function RequireAuth({ children }) {
  const { isLoggedIn, checking } = useAuth()
  const location = useLocation()
  if (checking) return <p className="container" style={{ padding: '64px 0' }}>Loading…</p>
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
