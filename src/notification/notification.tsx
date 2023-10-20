import React, { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './Notification.css'

const Notification: React.FC = () => {

  const handleCloseWorkTab = () => {
    chrome.runtime.sendMessage({ action: 'work'})
  }

  const handleCloseBreakTab = () => {
    chrome.runtime.sendMessage({ action: 'break'})
  }

  return(
    <div className='main'>
      <h1>notifications</h1>
      <button onClick={handleCloseWorkTab}>Keep Working?</button>
      <button onClick={handleCloseBreakTab}>Rest for a bit</button>
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Notification />)