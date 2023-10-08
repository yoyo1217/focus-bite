import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  return(
    <>
      <h1>notifications</h1>
    </>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)