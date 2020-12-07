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
    expect(wrapper.vm.canPlay()).toBe(true)
    expect(wrapper.vm.canUseConnection()).toBe(true)
    //expect(wrapper.vm.canPlayMimeType()).toBe(true)
    expect(wrapper.vm._setVolume).toThrow('[vue-hifi] #_setVolume interface not implemented')
  })

  test('canPlayMimeType', () => {
    const whiteListWrapper = mount(BaseConnection, {
      render () {},
      props: {
        acceptMimeTypes: [ 'application/vnd.apple.mpegurl' ]
      }
    })
    expect(whiteListWrapper.vm.acceptMimeTypes).toBeFalsy()
    expect(whiteListWrapper.vm.canPlayMimeType('application/vnd.apple.mpegurl')).toBe(true)
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
})
