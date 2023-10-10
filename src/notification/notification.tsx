import React, { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  const [newTabId, setNewTabId] = useState(null)

  const handleCloseTab = () => {
    chrome.runtime.sendMessage({ action: 'getTabId'})
  }

  return(
    <>
      <h1>notifications</h1>
      <button onClick={handleCloseTab}>Keep Working?</button>
      <button onClick={handleCloseTab}>Rest for a bit</button>
    </>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)