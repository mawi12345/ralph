import React, { useState, useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'
import HomePage from './pages/Home.mdx'
import CatalogPage from './pages/Catalog.mdx'

// Define available routes
export const routes = [
  { path: '/', name: 'home', component: HomePage, title: 'Home' },
  { path: '/catalog', name: 'catalog', component: CatalogPage, title: 'Questions Catalog' },
]

// Helper to get route from pathname
function getRouteFromPath(pathname, basePath = '/ralph/') {
  // Remove base path and trailing slash
  let path = pathname.replace(basePath, '/').replace(/\/$/, '') || '/'
  // Handle index.html
  if (path.endsWith('/index.html')) {
    path = path.replace('/index.html', '') || '/'
  }
  return routes.find(r => r.path === path) || routes[0]
}

const components = {
  h1: (props) => <h1 style={{ color: '#2c3e50' }} {...props} />,
  h2: (props) => <h2 style={{ color: '#34495e' }} {...props} />,
  p: (props) => <p style={{ marginBottom: '1rem' }} {...props} />,
}

function App({ serverUrl }) {
  // Determine initial route from server URL or browser location
  const getInitialRoute = () => {
    if (serverUrl) {
      return getRouteFromPath(serverUrl)
    }
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname)
    }
    return routes[0]
  }

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute)

  // Handle browser back/forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handlePopState = () => {
      setCurrentRoute(getRouteFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Navigate to a new route
  const navigate = (routeName) => {
    const route = routes.find(r => r.name === routeName) || routes[0]
    setCurrentRoute(route)
    if (typeof window !== 'undefined') {
      const newUrl = `/ralph${route.path === '/' ? '/' : route.path + '/'}`
      window.history.pushState({}, '', newUrl)
      window.scrollTo(0, 0)
    }
  }

  // Make navigation available to MDX pages
  const mdxComponents = {
    ...components,
    NavigateButton: ({ to, children }) => (
      <button
        onClick={() => navigate(to)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '10px 5px',
        }}
      >
        {children}
      </button>
    ),
  }

  const PageComponent = currentRoute.component

  return (
    <MDXProvider components={mdxComponents}>
      <div className="App">
        <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          {routes.map(route => (
            <button
              key={route.name}
              onClick={() => navigate(route.name)}
              style={{
                padding: '8px 16px',
                marginRight: '10px',
                backgroundColor: currentRoute.name === route.name ? '#0066cc' : '#f0f0f0',
                color: currentRoute.name === route.name ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {route.title}
            </button>
          ))}
        </nav>
        <PageComponent />
      </div>
    </MDXProvider>
  )
}

export default App
