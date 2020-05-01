import { writable } from 'svelte/store'

const { subscribe, set, update } = writable({})

const updateCurrent = () => {
  requestAnimationFrame(updateCurrent)

  if (window && window.radio) {
    const { currentTime, currentSrc } = window.radio
    if (!/radio\.freshair\./.test(currentSrc)) {
      localStorage.setItem(currentSrc, currentTime)
      update((times) => ({ ...times, [currentSrc]: currentTime }))
    }
  }
}
if (typeof window !== 'undefined')
  update(() => {
    setTimeout(updateCurrent, 0)
    return Object.fromEntries(Object.entries(localStorage))
  })
export const progress = {
  subscribe,
}
