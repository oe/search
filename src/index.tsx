import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(new URL('sw.ts', import.meta.url), { type: 'module' })
}

ReactDOM.render(<App />, document.getElementById('root'))