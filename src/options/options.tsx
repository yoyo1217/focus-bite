import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './options.css'
import { formatTime } from '../utils/utils'

const App = () => {
  const [inputVal, setInputVal] = useState('1500')
  const [warning, setWarning] = useState('')

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputVal(value)
    
    if(!value || (isNaN(value) || value < 1 || value > 6000 || !Number.isInteger(+value) || !/^\d+$/.test(value))){
      setWarning('Please enter an integer beteeen 1 and 1500')
    }else{
      setWarning('')
    }
  }


  const handleSubmit = () => {
    if(warning){
      alert('Cannot set timer: ' + warning)
      return;
    }
    chrome.runtime.sendMessage({action: 'pauseTimer'})
    const newTimeVal = parseInt(inputVal)
    chrome.storage.local.set({ timer: newTimeVal})
    chrome.action.setBadgeText({ text: formatTime(newTimeVal)}) 
  }

  return(
    <>
    <h1>Settings</h1>
    <label>
      <h2>Time (seconds)</h2>
      <input type="number" min="1" max="6000" value={inputVal} onChange={handleInputChange}/>
      <button onClick={handleSubmit}>SET</button>
    </label>
    </>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)