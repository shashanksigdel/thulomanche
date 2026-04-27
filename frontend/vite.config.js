import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_API_PORT || 5001}`,
        changeOrigin: true
      }
    }
  }
})
