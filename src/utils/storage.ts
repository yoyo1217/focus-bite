// chrome.storage.local.get(["timer", "isRunning"]).then((res) => {
// })


export function getTime(): Promise<{timer: number, isRunning: boolean}>{
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
      // const min = Math.floor(res.timer / 60)
      // const sec = res.timer % 60
      // const time = `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`
      if(chrome.runtime.lastError){
        reject(chrome.runtime.lastError)
      }else {
        const timer = res.timer || 1500
        const isRunning = res.isRunning || false
        resolve({timer, isRunning})
      }
    })
  })
}



export function updateTime(): Promise<void>{
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
      res.isRunning = true
      if(res.timer > 0){
        const intervalId = setInterval(() => {
          res.timer--;
          console.log(res.timer);
          chrome.storage.local.set({ timer: res.timer }, () => {
            if(res.timer <= 0){
              clearInterval(intervalId)
              resolve()
            }
          })
        }, 1000)
      } else {
        reject("Timer is not running")
      }
    })
  })
}

// chrome.storage.local.set({ timer: 25}).then(() => {
//   console.log('value is set');
// })

