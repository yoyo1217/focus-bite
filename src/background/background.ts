import { formatTime, changeBadge, POMODORO_COLOR } from "../utils/utils";

let timer: number;
let isRunning: boolean;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timer: 1500, isRunning: false })
  changeBadge({ text: formatTime(1500), textColor: "white", backgroundColor: POMODORO_COLOR})
})

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  timer = res.timer !== undefined ? res.timer : 25 * 60
  isRunning = res.isRunning !== undefined ? res.isRunning : false
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === "pomodoroTimer" && isRunning){
      timer--;
      chrome.storage.local.set({ timer })

    if(timer <= 0){
      console.log("time up");
      changeBadge({ text: "End"})
      // chrome.tabs.create({ url: "notification.html"})
      resetTimer()
    }else{
      const min = formatTime(timer)
      chrome.action.setBadgeText({ text: min })
      console.log("timer changed at background.ts");
    }
  }
})

function startTimer(){
  chrome.storage.local.get(["timer"], (res) => {
    timer = res.timer
    isRunning = true
    chrome.storage.local.set({isRunning})
    chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 })
  })
}

function pauseTimer(){
  isRunning = false
  chrome.storage.local.set({isRunning})
  chrome.alarms.clear("pomodoroTimer")
}

function resetTimer(){
  timer = 25 * 60
  isRunning = false
  chrome.storage.local.set({timer, isRunning})
  const min = formatTime(timer)
  chrome.action.setBadgeText({ text: min })
  chrome.alarms.clear("pomodoroTimer")
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch(message.action){
    case 'startTimer':
      startTimer()
      break
    case 'pauseTimer':
      pauseTimer()
      break
    case 'resetTimer':
      resetTimer()
      break
  }
  sendResponse({timer, isRunning})
})