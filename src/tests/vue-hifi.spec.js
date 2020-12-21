/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import { createLocalVue, mount } from '@vue/test-utils'
import { describe, test, expect } from '@jest/globals'
import vueHifi from '../mixins/vue-hifi'
import BaseConnection from '../components/base-connection'
import HowlerConnection from '../components/howler-connection'
import HlsConnection from '../components/hls-connection'

Vue.use(Vuex)
// const localVue = createLocalVue()
// localVue.use(Vuex)

describe('Vue Hifi', () => {
    let store
    let actions
    let state

    beforeEach(() => {
        state = () => ({
            isLoading: false,
            isPlaying: false,
            currentSound: null,
            volume: 100,
            isMuted: false
        }),
        actions = {}
        const sound = mount(HlsConnection, {})
        store = new Vuex.Store({
            modules: {
                'vue-hifi': {
                    namespaced: true,
                    state,
                    getters: {
                        getCurrentSound () {
                            return sound.vm
                        },
                        getIsPlaying (state) {
                            // return true
                            return state.isPlaying
                        }
                    },
                    mutations: {
                        setIsPlaying (state, isPlaying) {
                            state.isPlaying = isPlaying
                        }
                    }
                }
            }
        })
    })

    test('it exists', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const wrapper = mount(testComponentType, { store })

        expect(wrapper.is(testComponentType)).toBe(true)

        wrapper.vm.toggleMute()
    })

    test('it plays', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const sound = mount(HlsConnection, {})
        const wrapper = mount(testComponentType, { store, localVue })
        const spy = jest.spyOn(wrapper.vm, '_attemptToPlaySound')
        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('it pauses', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const wrapper = mount(testComponentType, { store })
        const sound = store.getters['vue-hifi/getCurrentSound']
        expect(sound).toBeDefined()
        const spy = jest.spyOn(sound, 'pause')

        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.pause()

        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('it stops', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const wrapper = mount(testComponentType, { store })
        const sound = store.getters['vue-hifi/getCurrentSound']
        expect(sound).toBeDefined()
        const spy = jest.spyOn(sound, 'stop')

        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.stop()

        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('it toggle pauses', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const wrapper = mount(testComponentType, { store })
        const sound = store.getters['vue-hifi/getCurrentSound']
        expect(sound).toBeDefined()
        const spy = jest.spyOn(sound, 'togglePause')

        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.togglePause()

        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('it pauses previously playing audio', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const wrapper = mount(testComponentType, { store })
        const spy = jest.spyOn(wrapper.vm, 'stop') // pause really means a 'hard stop'

        wrapper.vm.play(['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'])
        wrapper.vm.$store.commit('vue-hifi/setIsPlaying', true)
        wrapper.vm.play()
        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('it loads a url', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi],
            render () {}
        })
        const wrapper = mount(testComponentType, { store })

        // handle invalid inputs
        expect(wrapper.vm._load([])).toBe(false)
        expect(wrapper.vm._load('not an array')).toBe(false)
        expect(wrapper.vm._load(['https://valid.url.com/sound.m3u8'])).not.toBe(false)
    })

    test('it registers/unregisters to receive events from a sound', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('TestComponent', {
            mixins: [vueHifi]
        })
        const wrapper = mount(testComponentType, { store })

        expect(wrapper.vm._registerEvents).toBeDefined()
        expect(wrapper.vm._unregisterEvents).toBeDefined()

        const sound = new HowlerConnection({ urls: ['https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'] })

        const spyOn = jest.spyOn(sound, '$on')
        wrapper.vm._registerEvents(sound)
        expect(sound.$on).toBeCalledTimes(12)

        const spyOff = jest.spyOn(sound, '$off')
        wrapper.vm._unregisterEvents(sound)
        expect(sound.$off).toBeCalledTimes(12)
    })
})
