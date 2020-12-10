import HowlerConnection from '../components/howler-connection'

export default {

  data () {
    return {
      _sound: null
    }
  },

  computed: {
    isPlaying: function() {
      return this.$data._sound ? this.$data._sound.isPlaying : false
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

    /**
     * Iterate the given array of URLs until a playable URL is found
     */
    _load (urls /* , options = {} */ ) {
      // sharedAudioAccessxs

      if (!(Array.isArray(urls) && urls.length > 0)) {
        return false // error
      }

      for (var url in urls) {
        //if (HowlerConnection.canPlay(url)) {
          return new HowlerConnection({
            propsData: {
              urls: [ urls[url] ]
            }
          })
        //}
      }
    },

    /**
     * Given an array of URLs, return a sound and play it
     *
     * @method play
     * @async
     * @params urls
     * @options
     * @return
     */

    play (urls, options = {}) {
      if (this.isPlaying) {
        // trigger current-sound-iterrupted
        this.pause()
      }

      //this.$set(this, 'isLoading', true)

      // setup event hooks
      let sound = this._load(urls, options)

      if (sound) {
        this.$data._sound = sound
        this.$data._sound.play(options)
      }
    },

    pause () {
      // make sure sound is playing/exists
      this.$data._sound.pause()
    },

    stop () {
      // make sure sound is playing/exists
      this.$data._sound.stop()
    },

    togglePause () {
      // make sure sound is playing/exists
      this.$data._sound.togglePause()
    },

    toggleMute () {

    },

    fastForward () {

    },

    rewind () {

    }
  }
}
