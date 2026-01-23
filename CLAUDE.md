# Ralph

Minimal MDX React project for GitHub Pages with SSR/Static Site Generation.

## Tech Stack

- React 19 with Vite 7
- MDX for content pages
- MathJax for math rendering (via remark-math and rehype-mathjax)
- SSR with static HTML generation for each route

## Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production (generates static HTML for all routes)
- `bun run preview` - Preview production build

## Project Structure

- `src/pages/` - MDX content pages
- `src/App.jsx` - Main app component with routing
- `src/entry-client.jsx` - Client-side hydration entry point
- `src/entry-server.jsx` - Server-side rendering entry point
- `prerender.js` - Static HTML generation script
- `public/` - Static assets

## Adding New Routes

To add a new route, update the `routes` array in `src/App.jsx`:

```jsx
export const routes = [
  { path: '/', name: 'home', component: HomePage, title: 'Home' },
  { path: '/catalog', name: 'catalog', component: CatalogPage, title: 'Questions Catalog' },
  // Add new routes here
]
```
