let connectionCache = {}

export default {
  state: () => ({
    isLoading: false,
    isPlaying: false,
    currentSound: null,
    volume: 100,
    isMuted: false
  }),

  getters: {
    getCurrentSound (state) {
      if (state.currentSound && connectionCache[state.currentSound]) {
        return connectionCache[state.currentSound]
      }
      return null
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
    setCurrentSound (state, currentSound) {
      if (state.currentSound != currentSound.uuid) {
        delete connectionCache[state.currentSound]
      }
      connectionCache[currentSound.uuid] = currentSound
      state.currentSound = currentSound.uuid
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
  },
  namespaced: true
}
