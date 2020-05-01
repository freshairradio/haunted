import { writable } from 'svelte/store'

const { subscribe, set, update } = writable({ live: false, podcast: null })
const setup = (
  force = false,
  src = 'https://radio.freshair.org.uk/zetta?' + Date.now(),
  volume = 0
) => {
  console.log('setup', force, src, !!window.radio)
  if (window && (!window.radio || force)) {
    if (force && !!window.radio) {
      window.radio.pause()
      window.radio = null
    }
    console.log('Creating audio')
    window.radio = new Audio(src)
    window.radio.crossOrigin = 'anonymous'
    window.radio.volume = volume
    window.radio.play()
  }
}

export const live = {
  subscribe,
  pause_podcast: ({ src, title, img }) =>
    update((playing) => {
      console.log('pause_podcast')
      setup(playing.podcast ? playing.podcast.src != src : true, src, 1)
      if (window && playing.playing) window.radio.pause()
      return {
        live: false,
        podcast: { src, title, img },
        playing: false,
      }
    }),
  play_podcast: ({ src, title, img }) =>
    update((playing) => {
      console.log('play_podcast')

      setup(playing.podcast ? playing.podcast.src != src : true, src, 1)
      if (window && !playing.playing) window.radio.play()

      return {
        live: false,
        podcast: { src, title, img },
        playing: true,
      }
    }),
  play: () =>
    update((playing) => {
      setup(!!playing.podcast)
      if (window) window.radio.volume = 1
      return { live: true, podcast: null, playing: false }
    }),
  stop: () =>
    update((playing) => {
      setup()
      if (window) window.radio.volume = 0
      return { live: false, podcast: null, playing: false }
    }),
  toggle: () =>
    update((playing) => {
      setup(!!playing.podcast)
      if (window) window.radio.volume = playing.live ? 0 : 1
      return { live: !playing.live, podcast: null, playing: false }
    }),
}
