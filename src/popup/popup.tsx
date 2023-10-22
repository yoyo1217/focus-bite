import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Timer from '../components/Timer'

import '@fontsource/playpen-sans'
import './popup.css'


const App = () => {
  return(
    <div className='main'>
        <h1>Focus Bite</h1>
        <Timer />
    </div>
  )
}


const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)