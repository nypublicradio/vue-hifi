<script>
import Vue from 'vue'

let uniqueConnectionId = 0

const BaseConnection = Vue.extend({

  props: {
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

    isErrored: {
      type: Boolean,
      default: false
    },

    error: {
      type: Object,
      default: null
    },

    urls: {
      type: Array,
      default: undefined
    },

    volume: {
      type: Number,
      default: 100
    }
  },

  computed: {
    isStream () {
      return true // only streams supported so far
    },

    isFastForwardable () {
      return false
    },

    isRewindable () {
      return false
    },

    duration () {
      return 0
    },

    percentLoaded () {
      return 0
    },

    position () {
      return 0
    }
  },

  beforeCreate () {
    this.uuid = uniqueConnectionId.toString()
    uniqueConnectionId += 1
  },

  created () {
    this.init()
  },

  beforeDestroy () {
    this.teardown()
  },

  methods: {

    // Initializer

    init () {
      this.$set(this, 'isLoading', true)

      this.$on('audio-played', () => {
        this.$set(this, 'hasPlayed', true)
        this.$set(this, 'isLoading', false)
        this.$set(this, 'isPlaying', true)
        this.$set(this, 'error', null)
      })

      this.$on('audio-paused', () => {
        this.$set(this, 'isPlaying', false)
      })

      this.$on('audio-ended', () => {
        this.$set(this, 'isPlaying', false)
      })

      this.$on('audio-ready', () => {
        // this.$set(this, 'duration', this._audioDuration())
      })

      this.$on('audio-load-error', (e) => {
        if (this.hasPlayed) {
          this.$set(this, 'isLoading', false)
          this.$set(this, 'isPlaying', false)
        }
        this.$set(this, 'error', e)
      })

      this.$on('audio-loaded', () => {
        this.$set(this, 'isLoading', false)
      })

      this.$on('audio-loading', (info) => {
        if (info && info.percentLoaded) {
          this.$set(this, 'percentLoaded', info.percentLoaded)
        }
      })

      try {
        this._setup()
      } catch (e) {
        this.$emit('audio-load-error', `Error in _setup ${e.message}`)
      }
    },

    // Destruction

    willDestroy () {
      // what is vue equivalent to Ember.willDestroy()?
    },

    // Public Interface

    fastForward () {},

    rewind () {},

    togglePause () {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play()
      }
    },

    // Public Interface -- to be defined in subclass

    _setup () {
      throw new Error('[vue-hifi] #_setup interface not implemented')
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

BaseConnection.canPlayMimeType = function (mimeType) {
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

export default BaseConnection
</script>
