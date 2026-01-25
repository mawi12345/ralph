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

- Use `\cdot` for multiplications and `\dfrac` for fractions
- Format big numbers with thousands separators (groups of 3) with a space `\,`. Example $$ 12\,300\,000\,000\,000 \cdot 60 \cdot 60 = 44\,280\,000\,000\,000\,000 $$
- Use `\underline{\hspace{12mm}}` for fill in the blank questions

## Exercise format

- Each `<Exercise>` includes the question text and the solution
- The answer must be on the same line
- Exercise with multi step solutions should use <br /> for line breaks and start with a line break
- **Proofs (A: and E:)**: Always show the entire calculation process with all intermediate steps:
  1. Substitute variables with explicit factors (e.g., `3 \cdot 2` not just `6`)
  2. Evaluate powers (e.g., `2^2 = 4`)
  3. Calculate each multiplication
  4. Show the final result

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
