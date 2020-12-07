import HowlerConnection from '../components/howler-connection'

export default {
  data () {
    return {
      _howlConnection: null
    }
  },

  computed: {
    isPlaying: function() {
      return this.$data._howlConnection ? this.$data._howlConnection.isPlaying : false
    }
  },

  props: {
    isMobileDevice: {
      type: Boolean,
      default: false
    },

    useSharedAudioAccess: {
      type: Boolean,
      default: false
    },

    currentSound: {
      type: Object,
      default: null
    },

    currentMetadata: {
      type: Object,
      default: null
    },

    isLoading: {
      type: Boolean,
      default: false
    },

    isStream: {
      type: Boolean,
      default: true
    },

    isFastForwardable: {
      type: Boolean,
      default: false
    },

    isRewindable: {
      type: Boolean,
      default: false
    },

    isMuted: {
      type: Boolean,
      default: false
    },

    duration: {
      type: Number,
      default: 0.0
    },

    percentLoaded: {
      type: Number,
      default: 0.0
    },

    // pollInterval (needed?)

    id3TagMetadata: {
      type: Object,
      default: null
    },

    defaultVolume: {
      type: Number,
      default: 1.0
    },

    position: {
      type: Number,
      default: 0.0
    },

    volume: {
      type: Number,
      default: 1.0
    }
  },

  methods: {

    load () {

    },

    play (/* urlsOrPromise, options = {} */) {
      if (!this.$data._howlConnection) {
        this.$data._howlConnection = new HowlerConnection()
      } else if (this.isPlaying) {
        this.pause()
      }
      this.$data._howlConnection.play()
    },

    pause () {
      // make sure sound is playing/exists
      this.$data._howlConnection.pause()
    },

    stop () {
      // make sure sound is playing/exists
      this.$data._howlConnection.stop()
    },

    togglePause () {
      // make sure sound is playing/exists
      this.$data._howlConnection.togglePause()
    },

    toggleMute () {

    },

    fastForward () {

    },

    rewind () {

    }
  }
}
