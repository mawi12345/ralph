import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  base: '/ralph/',
  plugins: [
    { enforce: 'pre', ...mdx() },
    react()
  ],
  build: {
    outDir: 'dist'
  }
})
