import { writable, derived } from 'svelte/store'
import { throttle } from 'lodash'
const { subscribe, set, update } = writable({
  podcast: null,
  src: null,
  live: false,
  paused: true,
  volume: 0,
  currentTime: 0,
  duration: 0,
  ref: null,
  analyser: null,
  bufferLength: 16384,
  others:
    typeof window != 'undefined' && localStorage.getItem('currentTime')
      ? JSON.parse(localStorage.getItem('currentTime'))
      : {},
})
const throttledUpdate = throttle((v) => {
  if (typeof window != 'undefined')
    setTimeout(() => localStorage.setItem('currentTime', JSON.stringify(v)), 0)
}, 1000)

const audio = {
  set,
  subscribe,
  playPodcast: (podcast) => {
    return update((v) => {
      if (!/radio\.freshair/.test(v.src))
        v.others[v.src] = { current: v.ref.currentTime, duration: v.duration }

      let storedCurrent = v.others[podcast.audio]
      if (!storedCurrent) {
        v.others[podcast.audio] = { current: 0, duration: 0 }
        storedCurrent = 0
      } else {
        storedCurrent = storedCurrent.current
      }
      setTimeout(() => {
        v.ref.play()

        v.ref.currentTime = storedCurrent
      })
      return {
        ...v,
        podcast,
        src: podcast.audio,
        live: false,
        volume: 1,
        paused: false,
        currentTime: storedCurrent,
      }
    })
  },
  pausePodcast: () => {
    return update((v) => {
      setTimeout(() => v.ref.pause())
      v.others[v.src] = { current: v.ref.currentTime, duration: v.duration }
      return {
        ...v,
        paused: true,
      }
    })
  },
  playLive: () => {
    return update((v) => {
      v.others[v.src] = { current: v.ref.currentTime, duration: v.duration }

      setTimeout(() => v.ref.play())

      return {
        ...v,
        src: v.live
          ? v.src
          : 'https://radio.freshair.org.uk/radio?' + Date.now(),

        live: true,
        paused: false,
        volume: 1,
        currentTime: v.live ? v.currentTime : 0,
      }
    })
  },
  pauseLive: () => {
    return update((v) => {
      return {
        ...v,
        volume: 0,
      }
    })
  },
}
const others = derived(audio, ($audio) => {
  if (/radio\.freshair/.test($audio.src)) return $audio.others
  return {
    ...$audio.others,
    [$audio.src]: { current: $audio.currentTime, duration: $audio.duration },
  }
})
others.subscribe((change) => {
  throttledUpdate(change)
})

export { audio, others }
