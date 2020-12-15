import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoading: false,
        isPlaying: false,
        sound: null,
        volume: 100,
        isMuted: false
    },
    getters: {
        getSound (state) {
            return state.sound
        },
        getIsLoading (state) {
            return state.isLoading
        },
        getIsPlaying (state) {
            return state.isPlaying
        },
        getVolume (state) {
            return state.volume
        },
        getIsMuted (state) {
            return state.isMuted
        }
    },

    mutations: {
        setSound (state, sound) {
            state.sound = sound
        },
        setIsLoading (state, isLoading) {
            state.isLoading = isLoading
        },
        setIsPlaying (state, isPlaying) {
            state.isPlaying = isPlaying
        },
        setVolume (state, volume) {
            state.volume = volume
        },
        setIsMuted (state, isMuted) {
            state.isMuted = isMuted
        }
    }
})
