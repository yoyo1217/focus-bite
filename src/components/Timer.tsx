import React, { useState, useEffect } from "react"
import { formatTime, changeBadge, POMODORO_COLOR, TimerStatus } from "../utils/utils"
import "./Timer.css"


const Timer = () => {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["timer", "isRunning"], res => {
      setTimer(res.timer)
      setIsRunning(res.isRunning)
    })

    const handleStorageChange = changes => {
      if('timer' in changes){
        setTimer(changes.timer.newValue)
        console.log("timer changed at Timer.tsx", "timer: ", changes.timer.newValue);
        changeBadge({ text: formatTime(changes.timer.newValue)})
      }

      if('isRunning' in changes){
        console.log("isRunning changed at Timer.tsx");
        setIsRunning(changes.isRunning.newValue)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const startTimer = () => {
    chrome.storage.local.get(["timer"], (res) => {
      console.log("startTimer", res.timer);
    })
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
      <h2 id="time">{formatTime(timer)}</h2>
      <div >
        <button onClick={isRunning ? pausetTimer : startTimer}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button onClick={resetTimer}>reset</button>
        <p>Is Running: {isRunning ? "Yes" : "No"}</p>
        {/* <p>isBreak: {isBreak ? "Yes" : "No"}</p> */}
      </div>
    </>
  )
}

export default Timer