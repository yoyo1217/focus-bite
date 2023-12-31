import { formatTime, changeBadge, POMODORO_COLOR, BREAK_COLOR, TimerState } from "../utils/utils";

let currentTimer: number;
let isRunning: boolean;

// Default values on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ currentTimer: 1500, workTimer: 1500 , breakTimer: 300, isRunning: false, timerOption: 1500, breakOption: 300, timerState: "focus" })
  changeBadge({ text: formatTime(1500), textColor: "white", backgroundColor: POMODORO_COLOR})
})

// Timer logic
chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === "pomodoroTimer" && isRunning){
    // console.log("currentTimer", currentTimer);
    currentTimer--;
    chrome.storage.local.set({ currentTimer })

    if(currentTimer <= 0){
      chrome.tabs.create({ url: "notification.html"}, (newTab) => {
      })
      resetTimer()
    }else{
      const min = formatTime(currentTimer)
      chrome.action.setBadgeText({ text: min })
    }
  }
})

function setTimer(timerType: "focus" | "break"){
  const timerKey = timerType === "focus" ? "currentTimer" : "breakTimer"
  chrome.storage.local.get(timerKey, res => {
    currentTimer = res[timerKey]
    isRunning = true

    chrome.storage.local.set({ isRunning, timerState: timerType })
  })

  chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 })
}

function pauseTimer(){
  isRunning = false
  chrome.storage.local.set({isRunning})
  chrome.alarms.clear("pomodoroTimer")
}

function resetTimer(currentTimerState?: TimerState){
  chrome.storage.local.get(["currentTimer", "isRunning", "timerOption", "breakOption"], (res) => {
    const isFocus = currentTimerState === "focus" ;
    const currentOption = isFocus ? res.timerOption : res.breakOption;
    const targetColor = isFocus ? POMODORO_COLOR : BREAK_COLOR;

    if(isFocus){
      chrome.storage.local.set({ workTimer: currentOption})
    }else{
      chrome.storage.local.set({ breakTimer: currentOption})
    }

    chrome.storage.local.set({
      currentTimer: currentOption, isRunning: false,  
    });
    const min = formatTime(currentOption);

    changeBadge({ text: min, textColor: "white", backgroundColor: targetColor });

    chrome.alarms.clear("pomodoroTimer");
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch(message.action){
    case 'focusTimer':
      setTimer("focus")
      break
    case 'breakTimer':
      setTimer("break")
      break
    case 'pauseTimer':
      pauseTimer()
      break
    case 'resetFocusTimer':
      resetTimer("focus")
      break
    case 'resetBreakTimer':
      resetTimer("break")
      break
  }
  sendResponse({timer: currentTimer, isRunning})
})



// Notification tabs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'work'){
    // sendResponse({ tabId: sender.tab.id})
    // if(sender.tab && sender.tab.id){
      chrome.tabs.remove(sender.tab.id)
      chrome.storage.local.get("timerOption", res => {
        currentTimer = res.timerOption
        isRunning = true
        changeBadge({ text: formatTime(currentTimer), textColor: "white", backgroundColor: POMODORO_COLOR})
        chrome.storage.local.set({currentTimer, isRunning, timerState: "focus"})
        chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 })
      })
    // }
  }else if(request.action === 'break'){
    // sendResponse({ tabId: sender.tab.id})
    // if(sender.tab && sender.tab.id){
      chrome.tabs.remove(sender.tab.id)
      chrome.storage.local.get("breakOption", res => {
        currentTimer = res.breakOption
        isRunning = true
        changeBadge({ text: formatTime(currentTimer), textColor: "white", backgroundColor: BREAK_COLOR})
        chrome.storage.local.set({currentTimer, isRunning, timerState: "break"})
        chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 })
      })
    // }
  }
})