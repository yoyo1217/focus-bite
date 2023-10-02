import React from 'react'
import { createRoot } from 'react-dom/client'
import './options.css'

const App = () => {
  return(
    <>
      <img src="icon.png" />
      <a href="https://www.flaticon.com/free-icons/short-term" title="short-term icons">Short-term icons created by Freepik - Flaticon</a>
    </>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)