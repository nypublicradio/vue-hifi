import { createLocalVue, mount } from '@vue/test-utils'
import { describe, test, expect } from '@jest/globals'
import vueHifi from '../mixins/vue-hifi'

describe('Vue Hifi', () => {
    test('it exists', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})

        expect(wrapper.is(testComponentType)).toBe(true)
        
        wrapper.vm.load()
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
        wrapper.vm.play()
        expect(wrapper.vm.$data._howlConnection).not.toBeNull()
    })

    test('it pauses', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play()
        wrapper.vm.pause()
        expect(wrapper.vm.$data._howlConnection).not.toBeNull()
    })

    test('it stops', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play()
        wrapper.vm.stop()
        expect(wrapper.vm.$data._howlConnection).not.toBeNull()
    })

    test('it toggle pauses', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        wrapper.vm.play()
        wrapper.vm.togglePause()
        expect(wrapper.vm.$data._howlConnection).not.toBeNull()
    })

    test('it pauses previously playing audio', () => {
        const localVue = createLocalVue()
        const testComponentType = localVue.component('test-component', {
            mixins: [vueHifi],
            render() {}
        })
        const wrapper = mount(testComponentType, {})
        const spy = jest.spyOn(wrapper.vm, 'pause')

        wrapper.vm.play()
        wrapper.vm.$data._howlConnection.$set(wrapper.vm.$data._howlConnection, 'isPlaying', true)
        wrapper.vm.play()
        expect(spy).toHaveBeenCalledTimes(1)
    })
})
