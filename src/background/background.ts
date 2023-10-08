let timer;
let isRunning;

function formatTime(seconds){
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
}

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  timer = res.timer !== undefined ? res.timer : 25 * 60
  isRunning = res.isRunning !== undefined ? res.isRunning : false
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === "pomodoroTimer" && isRunning){
      timer--;

    if(timer <= 0){
      console.log("time up");
      chrome.action.setBadgeText({text: 'End'})
      // chrome.tabs.create({ url: "notification.html"})
      resetTimer()
    }else{
      chrome.storage.local.set({ timer })
      const min = formatTime(timer)
      chrome.action.setBadgeText({ text: min })
    }
  }
})

function startTimer(){
  chrome.action.setBadgeText({text: ''});
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