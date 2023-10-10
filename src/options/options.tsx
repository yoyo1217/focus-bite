import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './options.css'
import { BREAK_COLOR, MAX_POMODORO_TIMER, POMODORO_COLOR, REGEX_NUMBER, changeBadge, formatTime } from '../utils/utils'

const Options = () => {
  const [time, setTime] = useState({ pomodoroTimer: "1500", breakTimer: "300"})
  const [warning, setWarning] = useState('')


  const handleInputChange = (e) => {
    const input = e.target.value

    if(input.match(REGEX_NUMBER)){
      if(!input || (isNaN(input) || input < 1 || input > MAX_POMODORO_TIMER || !Number.isInteger(+input))){
        setWarning(`Please enter an integer beteeen 1 and ${MAX_POMODORO_TIMER}`)
      }else{
        setTime((prev) => ({ ...prev, [e.target.name]: e.target.value}))
        setWarning('')
      }
    }
  }


  const handleSubmit = (timer: string, timerType: string) => {
    if(warning){
      alert('Cannot set timer: ' + warning)
      return;
    }

    chrome.runtime.sendMessage({action: 'pauseTimer'})
    switch (timerType) {
      case "pomodoro": {
        chrome.storage.local.set({ timer: time.pomodoroTimer, timerOption: timer})
        changeBadge({ text: formatTime(+timer), textColor: "white", backgroundColor: POMODORO_COLOR}) 
        break;
      }
      case "break": {
        chrome.storage.local.set({ timer: time.breakTimer, breakOption: timer})
        changeBadge({ text: formatTime(+timer), textColor: "white", backgroundColor: BREAK_COLOR}) 
        break;
      }
    }
  }

  return(
    <>
    <h1>Settings</h1>
    <h2>Time (seconds)</h2>
      <input type="number" name="pomodoroTimer" placeholder='900' onChange={handleInputChange}/>
      <button onClick={() => handleSubmit(time.pomodoroTimer, "pomodoro")}>SET</button>
      <h2>Break Time (seconds)</h2>
      <input type="number" name="breakTimer" placeholder='300' onChange={handleInputChange}/>
      <button onClick={() => handleSubmit(time.breakTimer, "break")}>SET</button>
    </>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Options />)