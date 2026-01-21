import React, { useState } from 'react'
import { MDXProvider } from '@mdx-js/react'
import HomePage from './pages/Home.mdx'
import CatalogPage from './pages/Catalog.mdx'

const components = {
  h1: (props) => <h1 style={{ color: '#2c3e50' }} {...props} />,
  h2: (props) => <h2 style={{ color: '#34495e' }} {...props} />,
  p: (props) => <p style={{ marginBottom: '1rem' }} {...props} />,
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Create navigation component that can be used in MDX
  const navigate = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
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

  return (
    <MDXProvider components={mdxComponents}>
      <div className="App">
        <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: currentPage === 'home' ? '#0066cc' : '#f0f0f0',
              color: currentPage === 'home' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Home
          </button>
          <button
            onClick={() => navigate('catalog')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 'catalog' ? '#0066cc' : '#f0f0f0',
              color: currentPage === 'catalog' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Questions Catalog
          </button>
        </nav>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
      </div>
    </MDXProvider>
  )
}

export default App
