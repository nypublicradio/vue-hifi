import { createLocalVue, mount } from '@vue/test-utils'
import { describe, test, expect } from '@jest/globals'
import vueHifi from '../mixins/vue-hifi'
import BaseConnection from '../components/base-connection'

describe('Vue Hifi', () => {
    test('it exists', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})

        expect(wrapper.is(testComponentType)).toBe(true)

        wrapper.vm.toggleMute()
        wrapper.vm.fastForward()
        wrapper.vm.rewind()
    })

    test('it plays', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        expect(wrapper.vm.$data._sound).not.toBeNull()
        expect(wrapper.vm.$data._sound).toBeInstanceOf(BaseConnection)
    })

    test('it pauses', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.pause()
        expect(wrapper.vm.$data._sound).not.toBeNull()
    })

    test('it stops', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.stop()
        expect(wrapper.vm.$data._sound).not.toBeNull()
    })

    test('it toggle pauses', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.togglePause()
        expect(wrapper.vm.$data._sound).not.toBeNull()
    })

    test('it pauses previously playing audio', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        const spy = jest.spyOn(wrapper.vm, 'pause')

        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.$data._sound.$set(wrapper.vm.$data._sound, 'isPlaying', true)
        wrapper.vm.play()
        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('it loads a url', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})

        // handle invalid inputs
        expect(wrapper.vm._load([])).toBe(false)
        expect(wrapper.vm._load('not an array')).toBe(false)
        expect(wrapper.vm._load(['https://valid.url.com/sound.m3u8'])).not.toBe(false)
    })
})
