import { describe, test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import HowlerConnection from '../components/howler-connection'

describe('howler-connection', () => {
  test('it exists', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.is(HowlerConnection)).toBe(true)
  })

  test('it plays', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm.play).not.toThrow('[vue-hifi] #play interface not implemented')

    wrapper.vm.play()

    expect(wrapper.vm.$data._howl).not.toBeNull()
    expect(wrapper.vm.$data._howl).toBeInstanceOf(Howl)
  })

  test('it pauses', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm.pause).not.toThrow('[vue-hifi] #pause interface not implemented')
  })

  test('it stops', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm.stop).not.toThrow('[vue-hifi] #stop interface not implemented')
  })

  test('it sets the volume', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm._setVolume).not.toThrow('[vue-hifi] #_setVolume interface not implemented')
  })

  test('it sets the playback position', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm._setPosition).not.toThrow('[vue-hifi] #_setPosition interface not implemented')
  })

  test('it gives the current position', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm._currentPosition).not.toThrow('[vue-hifi] #_currentPosition interface not implemented')
  })

  test('it gives the duration', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm._audioDuration).not.toThrow('[vue-hifi] #_audioDuration interface not implemented')
  })

  test('it tears down', () => {
    const wrapper = mount(HowlerConnection, {
      render () {}
    })
    expect(wrapper.vm.teardown).not.toThrow('[vue-hifi] #teardown interface not implemented')
  })
})
