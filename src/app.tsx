import React from 'react'
import Title from './title'
import Search from './search'
import Bg from './background'
import './app.scss'

const App: React.FC = function App() {
  return (<div className="app">
    <Bg />
    <div id="app-content">
      <Title />
      <Search />
    </div>
  </div>
  )
}

export default App
