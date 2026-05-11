import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy para evitar CORS en desarrollo:
    // Las peticiones a /api se redirigen al servidor PHP local
    proxy: {
      '/api': {
        target: 'http://localhost',          // XAMPP/LAMP en localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/carpush-backend/api'),
      },
    },
  },
})
