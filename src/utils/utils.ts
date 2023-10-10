export const POMODORO_COLOR = "#BA4949"
export const BREAK_COLOR = "#55C500"
export const MAX_POMODORO_TIMER = 6000
export const REGEX_NUMBER = /^[0-9]*$/g

export enum TimerStatus {
  Running = 'Running',
  NotRunning = 'NotRunning',
  Break = 'Break'
}

export function formatTime(seconds: number){
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
}

interface BadgeOptions {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
}

export function changeBadge({ text, textColor, backgroundColor}: BadgeOptions){
  text && chrome.action.setBadgeText({ text })
  textColor && chrome.action.setBadgeTextColor({ color: textColor})
  backgroundColor && chrome.action.setBadgeBackgroundColor({ color: backgroundColor})
}