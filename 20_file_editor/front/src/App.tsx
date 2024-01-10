import React from 'react'
import logo from './logo.svg'
import './App.css'
import { TextEditor } from './components/TextEditor'

function App() {
  
  return (
    <div className="app">
      <header className="app-header"></header>
      <div className="app-main">
        <div className="app-sidebar"></div>
        <TextEditor />
      </div>
    </div>
  )
}

export default App
