import { useEffect } from 'react'
import { useLocation } from 'react-router'

// У SPA браузер не прокручує сторінку вгору при переході між "сторінками" (адже нова сторінка не вантажиться).
// Цей компонент робить це вручну, коли змінюється шлях (pathname).
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
