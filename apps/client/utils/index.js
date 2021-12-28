export const isServer = () => {
  return typeof window === "undefined"
}
export const timerDown = (date) => {
  const now = new Date().getTime()
  const timeLeft = new Date(date) - now
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  return { seconds, minutes, hours, days, isTimeUp: timeLeft < 0 }
}
