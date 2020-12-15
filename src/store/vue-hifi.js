export default {
  strict: true,

  state: {
    isLoading: false,
    isPlaying: false,
    sound: null
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
    }
  }
}
