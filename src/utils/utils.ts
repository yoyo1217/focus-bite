export const POMODORO_COLOR = "#D69A83"
export const BREAK_COLOR = "#0D7E8C"
export const MAX_POMODORO_TIMER = 100

export type TimerState = 'focus' | 'break';

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