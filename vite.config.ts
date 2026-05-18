import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  // Dev / preview: frontend calls /api/* → Express on API_PORT (default 3001)
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api/, ''),
  },
  '/sitemap.xml': { target: 'http://localhost:3001', changeOrigin: true },
  '/robots.txt': { target: 'http://localhost:3001', changeOrigin: true },
} as const

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
})
