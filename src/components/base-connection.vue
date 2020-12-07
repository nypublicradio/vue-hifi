<script>
import Vue from 'vue'

export default Vue.extend({

  props: {
    debugName: { // computed
      type: String,
      default: 'base-connection'
    },

    pollInterval: {
      type: Number,
      default: 1000
    },

    timeout: {
      type: Number,
      default: 30000
    },

    hasPlayed: {
      type: Boolean,
      default: false
    },

    isLoading: {
      type: Boolean,
      default: false
    },

    isPlaying: {
      type: Boolean,
      default: false
    },

    isErrored: { // computed
      type: Boolean,
      default: false
    },

    error: {
      type: Object,
      default: null
    },

    isStream: { // computed
      type: Boolean,
      default: false
    },

    isFastForwardable: {
      type: Boolean,
      default: false
    },

    isRewindable: {
      type: Boolean,
      default: false
    },

    duration: {
      type: Number,
      default: 0
    },

    percentLoaded: {
      type: Number,
      default: 0
    },

    position: { // computed
      type: Number,
      default: 0
    }
  },

  methods: {

    // Methods from mixin in ember-hifi

    _setup (/* config */) {

    },

    canPlay () {
      return true
    },

    canUseConnection () {
      return true
    },

    canPlayMimeType (/* mimeType */) {
      return true
      // const mimeTypeWhiteList = this.acceptMimeTypes

      // if (mimeTypeWhiteList) {
      //   return mimeTypeWhiteList.includes(mimeType)
      // } else {
      //   return false
      // }
    },

    // Initializer

    init () {

    },

    // Destruction

    willDestroy () {
      // what is vue equivalent to Ember.willDestroy()?
    },

    // Internal Methods

    _detectTimeouts () {

    },

    // Public Interface

    fastForward () {

    },

    rewind () {

    },

    togglePause () {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play()
      }
    },

    // Public Interface -- to be defined in subclass

    setup () {
      throw new Error('[vue-hifi] #setup interface not implemented')
    },

    _setVolume () {
      throw new Error('[vue-hifi] #_setVolume interface not implemented')
    },

    _audioDuration () {
      throw new Error('[vue-hifi] #_audioDuration interface not implemented')
    },

    _currentPosition () {
      throw new Error('[vue-hifi] #_currentPosition interface not implemented')
    },

    _setPosition () {
      throw new Error('[vue-hifi] #_setPosition interface not implemented')
    },

    play () {
      throw new Error('[vue-hifi] #play interface not implemented')
    },

    pause () {
      throw new Error('[vue-hifi] #pause interface not implemented')
    },

    stop () {
      throw new Error('[vue-hifi] #stop interface not implemented')
    },

    teardown () {
      throw new Error('[vue-hifi] #teardown interface not implemented')
      // what is vue equivalent to teardown?
    }
  }
})
</script>
