import { formatTime, changeBadge, POMODORO_COLOR } from "../utils/utils";

let timer: number;
let isRunning: boolean;

// Default values on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timer: 1500, isRunning: false, timerOption: 1500, breakOption: 300 })
  changeBadge({ text: formatTime(1500), textColor: "white", backgroundColor: POMODORO_COLOR})
})

// Timer logic
chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === "pomodoroTimer" && isRunning){
      timer--;
      chrome.storage.local.set({ timer })

    if(timer <= 0){
      chrome.tabs.create({ url: "notification.html"}, (newTab) => {
      })
      // resetTimer()
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
  chrome.storage.local.get(["timer", "isRunning", "timerOption"], (res) => {
    chrome.storage.local.set({ timer: res.timerOption, isRunning: false})
    const min = formatTime(res.timerOption)
    changeBadge({ text: min})
    chrome.alarms.clear("pomodoroTimer")
  })
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



// Notification tabs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'getTabId'){
    sendResponse({ tabId: sender.tab.id})
    console.log(sender.tab.id);
    chrome.tabs.remove(sender.tab.id)
  }
})