import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CheckMark from '../components/CheckMark'
import './options.css'
import { BREAK_COLOR, MAX_POMODORO_TIMER, POMODORO_COLOR, REGEX_NUMBER, changeBadge, formatTime } from '../utils/utils'

const Options: React.FC = () => {
  const [time, setTime] = useState<{ pomodoroTimer: number, breakTimer: number} | undefined>({ pomodoroTimer: 1500, breakTimer: 300})
  const [warning, setWarning] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["timerOption", "breakOption"], (res) => {
      setTime({ pomodoroTimer: res.timerOption || 1500, breakTimer: res.breakOption || 300 })
    })
  }, [])

  const handleInputChange = (e) => {
    const input = e.target.value
    setTime((prev) => ({ ...prev, [e.target.name]: e.target.value}))

    if(input.match(REGEX_NUMBER)){
      if(!input || (isNaN(input) || input < 1 || input > MAX_POMODORO_TIMER || !Number.isInteger(+input))){
        setWarning(`Please enter an integer beteeen 1 and ${MAX_POMODORO_TIMER}`)
      }else{
        setWarning('')
      }
    }
  }

  const handleSubmit = (timer: number, timerType: string) => {
    console.log("handleSubmit");
    if(warning){
      alert('Cannot set timer: ' + warning)
      return;
    }

    chrome.runtime.sendMessage({action: 'pauseTimer'})
    if(timerType === "pomodoro"){
      console.log("time.pomodoroTimer", time.pomodoroTimer);
        chrome.storage.local.set({ currentTimer: time.pomodoroTimer, timerOption: time.pomodoroTimer, workTimer: time.pomodoroTimer ,timerState: "focus"})
        changeBadge({ text: formatTime(+timer), textColor: "white", backgroundColor: POMODORO_COLOR}) 
    }else {
        chrome.storage.local.set({ currentTimer: time.breakTimer, breakOption: time.breakTimer, breakTimer: time.breakTimer, timerState: "break"})
        changeBadge({ text: formatTime(+timer), textColor: "white", backgroundColor: BREAK_COLOR}) 
    }
    setNotificationType(timerType)
    setIsDisabled(true)
    setTimeout(() => {
      setNotificationType("")
      setIsDisabled(false)
    }, 2000)
  }

  return(
        <div className='main'>
        <h1>Setting</h1>
          <h1>Time (seconds)</h1>
          <div className='parent-container'>
            <div className='input-btn-container'>
              <input type="number" value={time.pomodoroTimer} name="pomodoroTimer" onChange={handleInputChange}/>
              <button 
                className='setBtn'
                onClick={() => handleSubmit(time.pomodoroTimer, "pomodoro")} 
                disabled={isDisabled}
              >
                {isDisabled ? "SAVING" : "SAVE"}
              </button>
            </div>
            {notificationType === "pomodoro" && <CheckMark />}
          </div>
          <h1>Break Time (seconds)</h1>
          <div className='parent-container'>
            <div className='input-btn-container'>
              <input type="number" value={time.breakTimer} name="breakTimer" onChange={handleInputChange}/>
              <button 
                className='setBtn'
                onClick={() => handleSubmit(time.breakTimer, "break")}
                disabled={isDisabled}
              >
                {isDisabled ? "SAVING..." : "SAVE"}
              </button>
            </div>
            {notificationType === "break" && <CheckMark />}
            </div>
      </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Options />)