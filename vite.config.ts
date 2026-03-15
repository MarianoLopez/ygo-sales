import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // Para GitHub Pages: ajustar base si el repo es 'Yugi-Sales' y se publica desde raíz
  base: '/Yugi-Sales/',
})
