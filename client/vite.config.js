import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    },
    target: 'es2015',
    minify: 'terser'
  },
  define: {
    'import.meta.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL),
    'import.meta.env.VITE_TMDB_IMAGE_BASE_URL': JSON.stringify('https://image.tmdb.org/t/p/w500'),
    'import.meta.env.VITE_CURRENCY': JSON.stringify('$')
  }
}) 