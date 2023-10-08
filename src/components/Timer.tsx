import React, { useState, useEffect } from "react"
import { getTime } from "../utils/storage"


const Timer = () => {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputVal, setInputVal] = useState('1500')
  const [warning, setWarning] = useState('')

  useEffect(() => {
    chrome.storage.local.get(["timer", "isRunning"], res => {
      setTimer(res.timer)
      setIsRunning(res.isRunning)
    })

    const handleStorageChange = changes => {
      if('timer' in changes){
        setTimer(changes.timer.newValue)
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

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputVal(value)
    
    if(!value || (isNaN(value) || value < 1 || value > 1500 || !Number.isInteger(+value) || !/^\d+$/.test(value))){
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

    const newTimeVal = parseInt(inputVal)
    setTimer(newTimeVal)
    chrome.storage.local.set({ timer: newTimeVal})
  }

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
    setIsRunning(false)
  }

  function formatTime(seconds){
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
  }


  return(
    <>
      <h2>{formatTime(timer)}</h2>
      <button onClick={isRunning ? pausetTimer : startTimer}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={resetTimer}>reset</button>
      <p>Is Running: {isRunning ? "Yes" : "No"}</p>
      <input type="number" min="1" max="9999" value={inputVal} onChange={handleInputChange}/>
      <button onClick={handleSubmit}>Set Timer</button>
    </>
  )
}

export default Timer