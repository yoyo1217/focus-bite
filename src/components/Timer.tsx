import React, { useState, useEffect } from "react"
import { formatTime, changeBadge, POMODORO_COLOR, TimerStatus } from "../utils/utils"
import "./Timer.css"


const Timer = () => {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["timer", "isRunning"], res => {
      setTimer(res.timer)
      setIsRunning(res.isRunning)
    })

    const handleStorageChange = changes => {
      if('timer' in changes){
        setTimer(changes.timer.newValue)
        changeBadge({ text: formatTime(changes.timer.newValue)})
      }

      if('isRunning' in changes){
        setIsRunning(changes.isRunning.newValue)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const handleAnimationEnd = () => {
    setShake(false)
  }

  const startTimer = () => {
    setShake(true)
    chrome.runtime.sendMessage({action: 'startTimer'})
    setIsRunning(true)
  }
  const pausetTimer = () => {
    chrome.runtime.sendMessage({action: 'pauseTimer'})
    setIsRunning(false)
  }
  const resetTimer = () => {
    chrome.runtime.sendMessage({action: 'resetTimer'})
    const min = formatTime(timer)
    changeBadge({ text: min, textColor: "white", backgroundColor: POMODORO_COLOR})
    setIsRunning(false)
  }


  return(
    <>
      <h2
        className={shake ? 'shake-animation' : ''}
        onAnimationEnd={handleAnimationEnd}  
      >{formatTime(timer)}</h2>
        <div className="btn-container">
          <button className="setBtn" onClick={isRunning ? pausetTimer : startTimer}>
            {isRunning ? "Stop" : "Start"}
          </button>
          <button className="setBtn" onClick={resetTimer}>reset</button>
        </div>
        {/* For debug */}
        <p>IsRunning: {isRunning ? "Yes" : "No"}</p>
        {/* <p>isBreak: {isBreak ? "Yes" : "No"}</p> */}
    </>
  )
}

export default Timer