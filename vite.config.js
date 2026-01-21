import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'

export default defineConfig({
  base: '/ralph/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeMathjax]
      })
    },
    react()
  ],
  build: {
    outDir: 'dist'
  }
})
