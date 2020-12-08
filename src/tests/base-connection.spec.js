import { describe, test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import BaseConnection from '../components/base-connection'

describe('base-connection', () => {
  test('it exists', () => {
    const wrapper = mount(BaseConnection, {
      render () {}
    })
    expect(wrapper.is(BaseConnection)).toBe(true)
  })

  test('mixin methods work', () => {
    const wrapper = mount(BaseConnection, {
      render () {}
    })
    expect(wrapper.is(BaseConnection)).toBe(true)
    expect(wrapper.vm._setVolume).toThrow('[vue-hifi] #_setVolume interface not implemented')
  })

  test('public interface method stubs throw errors', () => {
    const wrapper = mount(BaseConnection, {
      render () {}
    })
    expect(wrapper.vm.setup).toThrow('[vue-hifi] #setup interface not implemented')
    expect(wrapper.vm._setVolume).toThrow('[vue-hifi] #_setVolume interface not implemented')
    expect(wrapper.vm._audioDuration).toThrow('[vue-hifi] #_audioDuration interface not implemented')
    expect(wrapper.vm._currentPosition).toThrow('[vue-hifi] #_currentPosition interface not implemented')
    expect(wrapper.vm._setPosition).toThrow('[vue-hifi] #_setPosition interface not implemented')
    expect(wrapper.vm.play).toThrow('[vue-hifi] #play interface not implemented')
    expect(wrapper.vm.pause).toThrow('[vue-hifi] #pause interface not implemented')
    expect(wrapper.vm.stop).toThrow('[vue-hifi] #stop interface not implemented')
    expect(wrapper.vm.teardown).toThrow('[vue-hifi] #teardown interface not implemented')
  })

  test('non-inherited public interface methods work', () => {
    const wrapper = mount(BaseConnection, {
      render () {}
    })
    wrapper.vm.play = function () {}
    wrapper.vm.fastForward()
    wrapper.vm.rewind()
    wrapper.vm.togglePause()
  })

  test('internal methods work', () => {
    const wrapper = mount(BaseConnection, {
      render () {}
    })
    wrapper.vm.init()
    wrapper.vm._detectTimeouts()
    wrapper.vm.willDestroy()
  })

  test('property defaults', () => {
    const wrapper = mount(BaseConnection, {
      render () {}
    })
    expect(wrapper.vm.debugName).toBe('base-connection')
    expect(wrapper.vm.pollInterval).toBe(1000)
    expect(wrapper.vm.timeout).toBe(30000)
    expect(wrapper.vm.hasPlayed).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.isPlaying).toBe(false)
    expect(wrapper.vm.isErrored).toBe(false)
    expect(wrapper.vm.error).toBe(null)
    expect(wrapper.vm.isStream).toBe(false)
    expect(wrapper.vm.isFastForwardable).toBe(false)
    expect(wrapper.vm.isRewindable).toBe(false)
    expect(wrapper.vm.duration).toBe(0)
    expect(wrapper.vm.percentLoaded).toBe(0)
    expect(wrapper.vm.position).toBe(0)
  })

  test('static methods exist', () => {
    expect(BaseConnection._setup).toBeDefined()
    expect(BaseConnection.canPlayMimeType).toBeDefined()
    expect(BaseConnection.canPlay).toBeDefined()
    expect(BaseConnection.canUseConnection).toBeDefined()
  })

  test('canPlayMimeType without black/white list', () => {
    expect(BaseConnection.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(true)
  })

  test('canPlayMimeType with whitelist', () => {
    BaseConnection.acceptMimeTypes = [ 'application/vnd.apple.mpegurl', '2', '3' ]
    expect(BaseConnection.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(true)
    expect(BaseConnection.canPlayMimeType('2')).toBe(true)
    expect(BaseConnection.canPlayMimeType('3')).toBe(true)
    expect(BaseConnection.canPlayMimeType('unsupported/some.other.mime.type')).toBe(false)
    BaseConnection.acceptMimeTypes = undefined
  })

  test('canPlayMimeType with blacklist', () => {
    BaseConnection.rejectMimeTypes = [ 'application/vnd.apple.mpegurl', '2', '3' ]
    expect(BaseConnection.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(false)
    expect(BaseConnection.canPlayMimeType('2')).toBe(false)
    expect(BaseConnection.canPlayMimeType('3')).toBe(false)
    expect(BaseConnection.canPlayMimeType('supported/some.other.mime.type')).toBe(true)
    BaseConnection.rejectMimeTypes = undefined
  })

  test('canUseConnection', () => {
    expect(BaseConnection.canUseConnection()).toBe(true)
  })

  test('canPlay catches unusable connection', () => {
    const canUseConnection = BaseConnection.canUseConnection
    BaseConnection.canUseConnection = function () {
      return false
    }
    expect(BaseConnection.canPlay()).toBe(false)
    BaseConnection.canUseConnection = canUseConnection
  })

  test('canPlay with url.mimeType', () => {
    expect(BaseConnection.canPlay({ mimeType: 'application/vnd.apple.mpegurl' })).toBe(true)
  })

  test('canPlay throws an error for invalid url', () => {
    expect(BaseConnection.canPlay).toThrow('[vue-hifi] #URL must be a string or object with a mimeType property')
  })

  test('canPlay with string url', () => {
    expect(BaseConnection.canPlay('https://hls-live.wnyc.org/wnycfm32/playlist.m3u8')).toBe(true)
  })

  test('canPlay with string url with unsupported mime type', () => {
    expect(BaseConnection.canPlay('https://hls-live.wnyc.org/wnycfm32/playlist.xyz')).toBe(true)
  })
})
