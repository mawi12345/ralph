import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import HomePage from './pages/Home.mdx'

const components = {
  h1: (props) => <h1 style={{ color: '#2c3e50' }} {...props} />,
  h2: (props) => <h2 style={{ color: '#34495e' }} {...props} />,
  p: (props) => <p style={{ marginBottom: '1rem' }} {...props} />,
}

function App() {
  return (
    <MDXProvider components={components}>
      <div className="App">
        <HomePage />
      </div>
    </MDXProvider>
  )
}

export default App
