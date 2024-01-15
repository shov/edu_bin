import React from 'react'
import './App.css'
import { TextEditor } from './components/TextEditor/TextEditor'
import { TextContext } from './contexts/TextContext'

function App() {
  
  return (
    <div className="app">
      <TextContext>
        <TextEditor/>
      </TextContext>
    </div>
  )
}

export default App
