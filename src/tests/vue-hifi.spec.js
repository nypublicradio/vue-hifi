import { createLocalVue, mount } from '@vue/test-utils'
import { describe, test, expect } from '@jest/globals'
import vueHifi from '../mixins/vue-hifi'
import { EVENT_MAP } from '../mixins/vue-hifi'
import BaseConnection from '../components/base-connection'
import HowlerConnection from '../components/howler-connection'

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
        wrapper.vm.$data._sound.$set(wrapper.vm, 'isPlaying', true)
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

    test('it registers/unregisters to receive events from a sound', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
        })
        const wrapper = mount(testComponentType, {})

        expect(wrapper.vm._registerEvents).toBeDefined()
        expect(wrapper.vm._unregisterEvents).toBeDefined()

        let sound = new HowlerConnection({ urls: ['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'] })

        const spyOn = jest.spyOn(sound, '$on')
        wrapper.vm._registerEvents(sound)
        expect(sound.$on).toBeCalledTimes(12)

        const spyOff = jest.spyOn(sound, '$off')
        wrapper.vm._unregisterEvents(sound)
        expect(sound.$off).toBeCalledTimes(12)
    })
})
