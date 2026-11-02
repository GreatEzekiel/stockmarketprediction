import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages + relative asset resolution
export default defineConfig({
  plugins: [react()],
  base: './',
})
