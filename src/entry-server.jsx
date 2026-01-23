import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App, { routes } from './App.jsx'

export function render(url) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App serverUrl={url} />
    </React.StrictMode>
  )
  return { html }
}

export { routes }
