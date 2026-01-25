# Ralph

Minimal MDX React project for GitHub Pages with SSR/Static Site Generation.

## Language

- **Content**: All MDX content (pages, text) should be written in German
- **Code**: Components and code remain in English

## Tech Stack

- React 19 with Vite 7
- MDX for content pages
- MathJax for math rendering (via remark-math and rehype-mathjax)
- SSR with static HTML generation for each route

## MathJax

- Use `\times` for multiplications
- Format big numbers with thousands separators (groups of 3) with a space `\,`. Example $$ 12\,300\,000\,000\,000 \times 60 \times 60 = 44\,280\,000\,000\,000\,000 $$

## Exercise format

- Every `exercise` is wrap with a <div class="exercise">
- The content oh this div is a specification text followed by <span class="solution"> wrapping the solution. Keep the <span class="solution"> on the same line.
- Exercise with multi step solutions should use <br /> for line breaks and start with a line break.

## Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production (generates static HTML for all routes)
- `bun run preview` - Preview production build

## Project Structure

- `src/pages/` - MDX content pages
- `src/pages/:topic/index.mdx` - Every topic contains a `index.mdx` with examples.
- `src/App.jsx` - Main app component with routing
- `src/entry-client.jsx` - Client-side hydration entry point
- `src/entry-server.jsx` - Server-side rendering entry point
- `prerender.js` - Static HTML generation script
- `public/` - Static assets

## Adding New Routes

To add a new route, update the `routes` array in `src/App.jsx`:

```jsx
export const routes = [
  { path: "/", name: "home", component: HomePage, title: "Home" },
  // Add new routes here
];
```

Always add a new route when you add a page.
