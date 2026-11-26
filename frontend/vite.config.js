import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Проксі для розробки: запити /api/... та картинки товарів Vite пересилає на бекенд (порт 8080).
    // Для браузера це "той самий сайт", тому проблем із CORS під час розробки немає.
    proxy: {
      '/api': 'http://localhost:8080',
      '/images/products': 'http://localhost:8080',
    },
  },
})
