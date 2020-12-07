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
        wrapper.vm.pause()
        wrapper.vm.stop()
        wrapper.vm.togglePause()
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
})