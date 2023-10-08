import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { getTime, updateTime } from '../utils/storage'
import Timer from '../components/Timer'

import './popup.css'


const App = () => {
  const [timeLeft, setTimeLeft] = useState<number>(1500)
  const [isDisplay, setIsDisplay] = useState(true)


  return(
    <>
      <h1>Pomodoro</h1>
      <Timer />
      {/* <button onClick={updateTimer}>
        {timerData.isRunning ? "Stop" : "Start"}
      </button> */}
      {/* <Timer time={} isActive={null}/> */}
      {/* <button onClick={toggleTimer}>
        {isActive ? "Stop" : "Start"}
      </button> */}
      <a href="https://www.flaticon.com/free-icons/short-term" title="short-term icons">Short-term icons created by Freepik - Flaticon</a>
    </>
  )
}


const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)