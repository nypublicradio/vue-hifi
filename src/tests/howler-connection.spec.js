import { describe, test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import HowlerConnection from '../components/howler-connection'

describe('howler-connection', () => {

  test('it exists', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.is(HowlerConnection)).toBe(true)
  })

  test('it is set up', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm._setup).not.toThrow('[vue-hifi] #_setup interface not implemented')
  })

  test('it plays', () => {
    const wrapper = mount(HowlerConnection, {
      propsData: {
        urls: [
          // HLS/m3u8 should play on Safari, but not on Chrome and Firefox, which should play the 2nd url
          'https://hls-live.wnyc.org/wnycfm32/playlist.m3u8',
          'https://fm939.wnyc.org/wnycfm-app'
        ]
      }
    })
    expect(wrapper.vm.play).not.toThrow('[vue-hifi] #play interface not implemented')

    wrapper.vm.play()

    expect(wrapper.vm.$data._howl).not.toBeNull()
    expect(wrapper.vm.$data._howl).toBeInstanceOf(Howl)
  })

  test('it pauses', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm.pause).not.toThrow('[vue-hifi] #pause interface not implemented')
  })

  test('it stops', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm.stop).not.toThrow('[vue-hifi] #stop interface not implemented')
  })

  test('it sets the volume', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm._setVolume).not.toThrow('[vue-hifi] #_setVolume interface not implemented')
  })

  test('it sets the playback position', () => {
    const wrapper = mount(HowlerConnection, { })
    expect(wrapper.vm._setPosition).not.toThrow('[vue-hifi] #_setPosition interface not implemented')
  })

  test('it gives the current position', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm._currentPosition).not.toThrow('[vue-hifi] #_currentPosition interface not implemented')
  })

  test('it gives the duration', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm._audioDuration).not.toThrow('[vue-hifi] #_audioDuration interface not implemented')
  })

  test('it tears down', () => {
    const wrapper = mount(HowlerConnection, {})
    expect(wrapper.vm.teardown).not.toThrow('[vue-hifi] #teardown interface not implemented')
  })

  test('canPlayMimeType without black/white list', () => {
    const original = Audio.prototype.canPlayType
    Audio.prototype.canPlayType = function (mimeType) {
      return 'maybe'
    }
    expect(HowlerConnection.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(true)

    Audio.prototype.canPlayType = function (mimeType) {
      return 'probably'
    }
    expect(HowlerConnection.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(true)

    Audio.prototype.canPlayType = function (mimeType) {
      return ''
    }
    expect(HowlerConnection.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(false)

    Audio.prototype.canPlayType = original
  })

  test('it intializes the urls property', () => {
    const wrapper = mount(HowlerConnection, {
      propsData: {
        urls: [
          // HLS/m3u8 should play on Safari, but not on Chrome and Firefox, which should play the 2nd url
          'https://hls-live.wnyc.org/wnycfm32/playlist.m3u8',
          'https://fm939.wnyc.org/wnycfm-app'
        ]
      }
    })
    expect(wrapper.vm.urls).toBeDefined()
  })

  test('inherited static methods execute', () => {
  //  expect(HowlerConnection.canPlay('')).toBe(true)
  })

  test('howl event handlers emit events', () => {
    const wrapper = mount(HowlerConnection, {

    })
    expect(wrapper.vm._onload).toBeDefined()
    expect(wrapper.vm._onplay).toBeDefined()
    expect(wrapper.vm._onpause).toBeDefined()
    expect(wrapper.vm._onend).toBeDefined()
    expect(wrapper.vm._onstop).toBeDefined()
    expect(wrapper.vm._onloaderror).toBeDefined()
    expect(wrapper.vm._onseek).toBeDefined()

    wrapper.vm._onload()
    wrapper.vm._onplay()
    wrapper.vm._onpause()
    wrapper.vm._onend()
    wrapper.vm._onstop()
    wrapper.vm._onloaderror()
    wrapper.vm._onseek()
    let emitted = wrapper.emitted()
    expect(emitted['audio-loaded']).toBeDefined()
    expect(emitted['audio-loaded'].length).toBe(1)
    expect(emitted['audio-ready']).toBeDefined()
    expect(emitted['audio-ready'].length).toBe(1)
    expect(emitted['audio-played']).toBeDefined()
    expect(emitted['audio-played'].length).toBe(1)
    expect(emitted['audio-paused']).toBeDefined()
    expect(emitted['audio-paused'].length).toBe(2) // _onpause, _onstop
    expect(emitted['audio-ended']).toBeDefined()
    expect(emitted['audio-ended'].length).toBe(1)
    expect(emitted['audio-load-error']).toBeDefined()
    expect(emitted['audio-load-error'].length).toBe(1)
    expect(emitted['audio-position-changed']).toBeDefined()
    expect(emitted['audio-position-changed'].length).toBe(1)
  })
})
