import { useEffect, useState } from 'react'

// Власний хук: завантажує дані з API і повертає три стани — дані, завантаження, помилку.
// Використання: const { data, loading, error } = useApi(() => getProducts(filters), [filters])
// deps — від чого залежить запит: змінились фільтри -> запит виконується знову.
export function useApi(request, deps = []) {
  const key = JSON.stringify(deps)
  // key у стані — "для якого запиту ця відповідь". Якщо не збігається з поточним — ще завантажуємо.
  const [state, setState] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    let cancelled = false // якщо компонент зник або запит змінився — стару відповідь ігноруємо
    request()
      .then((data) => { if (!cancelled) setState({ key, data, error: null }) })
      .catch((error) => { if (!cancelled) setState({ key, data: null, error }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const loading = state.key !== key
  return { data: state.data, error: loading ? null : state.error, loading }
}
