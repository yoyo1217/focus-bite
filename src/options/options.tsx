import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CheckMark from '../components/CheckMark'
import '@fontsource/playpen-sans'
import './Options.css'
import { BREAK_COLOR, MAX_POMODORO_TIMER, POMODORO_COLOR, changeBadge, formatTime } from '../utils/utils'

const Options: React.FC = () => {
  const [time, setTime] = useState<{ pomodoroTimer: number, breakTimer: number} | undefined>({ pomodoroTimer: 25, breakTimer: 5})
  const [notificationType, setNotificationType] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["timerOption", "breakOption"], (res) => {
      const minPomodoro = res.timerOption / 60
      const minbreak = res.breakOption / 60
      setTime({ pomodoroTimer: minPomodoro || 25, breakTimer: minbreak || 5 })
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime((prev) => ({ ...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (timerType: string) => {
    const input = time[timerType]
      if(!input || (isNaN(Number(input)) || Number(input) < 1 || Number(input) > MAX_POMODORO_TIMER || !Number.isInteger(+input))){
        alert(`Please enter an integer beteeen 1 and ${MAX_POMODORO_TIMER}`)
        return;
      }

    chrome.runtime.sendMessage({action: 'pauseTimer'})
    if(timerType === "pomodoroTimer"){
      const sec = time.pomodoroTimer * 60
      chrome.storage.local.set({ 
        currentTimer: sec,
        timerOption: sec,
        workTimer: sec,
        timerState: "focus"
      })
      changeBadge({ 
        text: formatTime(sec),
        textColor: "white",
        backgroundColor: POMODORO_COLOR
      }) 
    }else {
      const sec = time.breakTimer * 60
      chrome.storage.local.set({ 
        currentTimer: sec,
        breakOption: sec,
        breakTimer: sec,
        timerState: "break"
      })
      changeBadge({
        text: formatTime(sec),
        textColor: "white",
        backgroundColor: BREAK_COLOR
      }) 
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
          <h1>Time (minutes)</h1>
          <div className='parent-container'>
            <div className='input-btn-container'>
              <input type="number" value={time.pomodoroTimer} name="pomodoroTimer" onChange={handleInputChange}/>
              <button 
                className='setBtn'
                onClick={() => handleSubmit("pomodoroTimer")} 
                disabled={isDisabled}
              >
                {isDisabled ? "SAVING..." : "SAVE"}
              </button>
            </div>
            {notificationType === "pomodoroTimer" && <CheckMark />}
          </div>
          <h1>Break Time (minutes)</h1>
          <div className='parent-container'>
            <div className='input-btn-container'>
              <input type="number" value={time.breakTimer} name="breakTimer" onChange={handleInputChange}/>
              <button 
                className='setBtn'
                onClick={() => handleSubmit("breakTimer")}
                disabled={isDisabled}
              >
                {isDisabled ? "SAVING..." : "SAVE"}
              </button>
            </div>
            {notificationType === "breakTimer" && <CheckMark />}
            </div>
      </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Options />)