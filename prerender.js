import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render, routes } = await import('./dist/server/entry-server.js')

// Generate HTML for each route
for (const route of routes) {
  const url = route.path
  const { html: appHtml } = render(url)

  const title = `${route.title} - Ralph`
  const html = template
    .replace('<!--app-html-->', appHtml)
    .replace('<!--app-title-->', title)

  // Determine output file path
  let filePath
  if (route.path === '/') {
    filePath = 'dist/index.html'
  } else {
    // Create directory for the route (e.g., dist/catalog/)
    const dir = `dist${route.path}`
    fs.mkdirSync(toAbsolute(dir), { recursive: true })
    filePath = `${dir}/index.html`
  }

  fs.writeFileSync(toAbsolute(filePath), html)
  console.log('Pre-rendered:', filePath)
}

// Clean up server build (not needed for deployment)
fs.rmSync(toAbsolute('dist/server'), { recursive: true, force: true })

console.log('Static HTML generation complete!')
