import { describe, test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import HlsConnection from '../components/hls-connection'
import HLS from 'hls.js'

describe('hls-connection', () => {
  test('it exists', () => {
    const wrapper = mount(HlsConnection, {})
    expect(wrapper.is(HlsConnection)).toBe(true)
  })

  test('it only plays HLS streams', () => {
    expect(HlsConnection.acceptMimeTypes).toBeDefined()
    expect(HlsConnection.acceptMimeTypes).toContain('application/vnd.apple.mpegurl')
  })

  test('it checks if HLS.js is supported', () => {
    expect(HlsConnection.canUseConnection).toBeDefined()

    const isSupported = HLS.isSupported
    HLS.isSupported = function () {
      return true
    }

    expect(HlsConnection.canUseConnection()).toBe(true)

    HLS.isSupported = isSupported
  })

  test('it is set up', () => {
    const wrapper = mount(HlsConnection, {})
    expect(wrapper.vm._setup).not.toThrow('[vue-hifi] #_setup interface not implemented')
    wrapper.vm._setup()
    expect(wrapper.vm.$data.hls).toBeDefined()
    expect(wrapper.vm.video).toBeDefined()
  })
})
