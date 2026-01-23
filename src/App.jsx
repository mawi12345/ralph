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
  h1: (props) => <h1 className="text-slate-800" {...props} />,
  h2: (props) => <h2 className="text-slate-700" {...props} />,
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
        className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer my-2.5 mx-1"
      >
        {children}
      </button>
    ),
  }

  const PageComponent = currentRoute.component

  // Handle link clicks for SPA navigation (progressive enhancement)
  const handleLinkClick = (e, routeName) => {
    // Only intercept if JavaScript is enabled
    if (typeof window !== 'undefined' && window.history) {
      e.preventDefault()
      navigate(routeName)
    }
    // Otherwise, let the browser handle the navigation normally
  }

  return (
    <MDXProvider components={mdxComponents}>
      <div className="App">
        <nav className="p-2.5 border-b border-gray-300 mb-5">
          {routes.map(route => {
            const href = `/ralph${route.path === '/' ? '/' : route.path + '/'}`
            const isActive = currentRoute.name === route.name

            return (
              <a
                key={route.name}
                href={href}
                onClick={(e) => handleLinkClick(e, route.name)}
                className={`inline-block px-4 py-2 mr-2.5 border border-gray-300 rounded no-underline cursor-pointer ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {route.title}
              </a>
            )
          })}
        </nav>
        <PageComponent />
      </div>
    </MDXProvider>
  )
}

export default App
