import React, { useState, useEffect } from "react"
import { formatTime, changeBadge, POMODORO_COLOR, TimerState, BREAK_COLOR } from "../utils/utils"
import "./Timer.css"


const Timer: React.FC = () => {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timerState, setTimerState] = useState<TimerState>("focus")
  const [shake, setShake] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["currentTimer", "isRunning", "timerOption", "breakOption", "timerState"], res => {
      const currentState = res.timerState
      const mainColor = currentState === "focus" ? POMODORO_COLOR : BREAK_COLOR
      setTimerState(currentState)
      document.body.style.backgroundColor = mainColor
      
      console.log("res.currentTimer", res.currentTimer);
      setTimer(res.currentTimer)
      setIsRunning(res.isRunning)
    })

    const handleStorageChange = (changes: any) => {
      if('currentTimer' in changes){
        setTimer(changes.currentTimer.newValue)
        changeBadge({ text: formatTime(changes.currentTimer.newValue)})
      }

      if('isRunning' in changes){
        setIsRunning(changes.isRunning.newValue)
      }

      if('timerOption' in changes){
        setTimer(changes.timerOption.newValue)
      }

      if('timerState' in changes){
        const currentState = changes.timerState.newValue
        const mainColor = currentState === "focus" ? POMODORO_COLOR : BREAK_COLOR
        setTimerState(currentState)
        document.body.style.backgroundColor = mainColor
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
    if(timerState === "focus"){
      chrome.runtime.sendMessage({action: 'focusTimer'})
    }else if(timerState === 'break'){
      chrome.runtime.sendMessage({action: 'breakTimer'})
    }
    setShake(true)
    setIsRunning(true)
  }

  const pausetTimer = () => {
    setIsRunning(false)
    if(timerState === "focus"){
      chrome.storage.local.set({workTimer: timer})
    }else{
      chrome.storage.local.set({breakTimer: timer})
    }
      chrome.runtime.sendMessage({action: 'pauseTimer'})
  }

  const resetTimer = (timerState? : TimerState) => {
    if(timerState === "focus"){
      chrome.runtime.sendMessage({action: 'resetFocusTimer'})
    }else if(timerState === "break"){
      chrome.runtime.sendMessage({action: 'resetBreakTimer'})
    }
    const min = formatTime(timer)
    changeBadge({ text: min, textColor: "white", backgroundColor: POMODORO_COLOR})
    setIsRunning(false)
  }

  const toggleSetTimer = () => {
    const newTimerState = timerState === "focus" ? "break" : "focus"
    const color = newTimerState === "focus" ? POMODORO_COLOR : BREAK_COLOR
    const storageKey = newTimerState === "focus" ? "workTimer" : "breakTimer"

    setTimerState(newTimerState)
    chrome.storage.local.set({ timerState: newTimerState })
    document.body.style.backgroundColor = color
    chrome.storage.local.get(storageKey, res => {
      setTimer(res[storageKey]) 
      chrome.storage.local.set({ currentTimer: res[storageKey]})
      changeBadge({ 
        text: formatTime(res[storageKey]),
        textColor: "white",
        backgroundColor: color,
      })
    })
  }

  return(
    <>
      <h2
        className={shake ? 'shake-animation' : ''}
        onAnimationEnd={handleAnimationEnd}  
      >{formatTime(timer)}</h2>
        <div className="btn-container">
          <button className={timerState === "focus" ? 'setBtn focus' : 'setBtn break'} onClick={isRunning ? pausetTimer : startTimer}>
            {isRunning ? "Stop" : "Start"}
          </button>
          <button className={timerState === "focus" ? 'setBtn focus' : 'setBtn break'} onClick={() => resetTimer(timerState)}>Reset</button>
          <button className={timerState === "focus" ? 'setBtn focus' : 'setBtn break'} onClick={toggleSetTimer} disabled={isRunning}>
            {timerState === "focus" ? "Break" : "Focus"}
          </button>
        </div>
        {/* For debug */}
        <p>IsRunning: {isRunning ? "Yes" : "No"}</p>
        {/* <p>isBreak: {isBreak ? "Yes" : "No"}</p> */}
        <p>TimerState: {timerState}</p>
    </>
  )
}

export default Timer