import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'
import rehypeNumberHeadings from './plugins/rehype-number-headings'

export default defineConfig({
  base: '/ralph/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeNumberHeadings, rehypeMathjax],
        providerImportSource: "@mdx-js/react"
      })
    },
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist'
  },
  ssr: {
    noExternal: ['@mdx-js/react']
  }
})
