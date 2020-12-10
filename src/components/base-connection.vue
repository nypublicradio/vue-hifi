<script>
import Vue from 'vue'
import { getMimeType } from '../utils/mime-types'

let BaseConnectionOriginal = Vue.extend({

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
    },

    urls: {
      type: Array,
      default: undefined
    }
  },

  methods: {

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

class BaseConnection extends BaseConnectionOriginal {
  static _setup = function (/* config */) {

  }

  static canPlayMimeType (mimeType) {
    const mimeTypeWhiteList = this.acceptMimeTypes
    const mimeTypeBlackList = this.rejectMimeTypes

    if (mimeTypeWhiteList) {
      return mimeTypeWhiteList.includes(mimeType)
    } else if (mimeTypeBlackList) {
      return !mimeTypeBlackList.includes(mimeType)
    } else {
      return true // assume true
    }
  }

  static canPlay (url) {
    let usablePlatform = BaseConnection.canUseConnection(url)

    if (!usablePlatform) {
      return false
    }

    if (typeof url === 'string') {
      let mimeType = getMimeType(url)

      if (!mimeType) {
        console.warn(`Could not determine mime type for ${url}`)
        console.warn(`Attempting to play urls with an unknown mime type can be bad for performance.`)
        return true
      } else {
        return BaseConnection.canPlayMimeType(mimeType)
      }
    } else if (url && url.mimeType) {
      return BaseConnection.canPlayMimeType(url.mimeType)
    } else {
      throw new Error('[vue-hifi] #URL must be a string or object with a mimeType property')
    }
  }

  static canUseConnection () {
    return true
  }
}

export default BaseConnection
</script>
