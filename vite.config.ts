import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // Para GitHub Pages: https://marianolopez.github.io/ygo-sales/
  base: '/ygo-sales/',
})
