import HowlerConnection from '../components/howler-connection'
import HlsConnection from '../components/hls-connection'

export const EVENT_MAP = [
  {event: 'audio-played',               handler: '_relayPlayedEvent'},
  {event: 'audio-paused',               handler: '_relayPausedEvent'},
  {event: 'audio-ended',                handler: '_relayEndedEvent'},
  {event: 'audio-duration-changed',     handler: '_relayDurationChangedEvent'},
  {event: 'audio-position-changed',     handler: '_relayPositionChangedEvent'},
  {event: 'audio-loaded',               handler: '_relayLoadedEvent'},
  {event: 'audio-loading',              handler: '_relayLoadingEvent'},
  {event: 'audio-position-will-change', handler: '_relayPositionWillChangeEvent'},
  {event: 'audio-will-rewind',          handler: '_relayWillRewindEvent'},
  {event: 'audio-will-fast-forward',    handler: '_relayWillFastForwardEvent'},
  {event: 'audio-metadata-changed',     handler: '_relayMetadataChangedEvent'}
]

export const SERVICE_EVENT_MAP = [
  {event: 'current-sound-changed' },
  {event: 'current-sound-interrupted' },
  {event: 'new-load-request' },
  {event: 'pre-load' }
]

const CONNECTIONS = [ HowlerConnection, HlsConnection ]

export default {

  data () {
    return {
      _sound: null,
      isPlaying: false,
      isLoading: false
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
      // sharedAudioAccess

      if (!(Array.isArray(urls) && urls.length > 0)) {
        return false // error
      }
      for (const urlIndex in urls) {
        for (const connectionIndex in CONNECTIONS) {  
          const connection = CONNECTIONS[connectionIndex]
          if (connection.canPlay(urls[urlIndex])) {
            return new connection({
              propsData: {
                urls: [ urls[urlIndex] ]
              }
            })
          }
        }
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

      this.isLoading = true
      let sound = this._load(urls, options)

      if (sound) {
        this._registerEvents(sound)
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

    },

    /**
    * Register events on a current sound. Audio events triggered on that sound
    * will be relayed and triggered on this service
    *
    * @method _registerEvents
    * @param {Object} sound
    * @private
    */

    _registerEvents(sound) {
      let service = this;
      EVENT_MAP.forEach(item => {
        sound.$on(item.event, service[item.handler]);
      });

      // Internal event for cleanup
      sound.$on('_will_destroy', () => {
        this._unregisterEvents(sound);
      })
    },

    /**
    * Register events on a current sound. Audio events triggered on that sound
    * will be relayed and triggered on this service
    *
    * @method _unregisterEvents
    * @param {Object} sound
    * @private
    */

    _unregisterEvents(sound) {
      if (!sound) {
        return;
      }

      let service = this;
      EVENT_MAP.forEach(item => {
        sound.$off(item.event, service[item.handler]);
      });
      sound.$off('_will_destroy')
    },

    /**
    * Relays an audio event on the sound to an event on the service
    *
    * @method relayEvent
    * @param {String, Object} eventName, sound
    * @private
    */

    _relayEvent(eventName, sound, info = {}) {
      this.$emit(eventName, sound, info);
    },

    /**
      Named functions so Vue can successfully register/unregister them
    */

    _relayPlayedEvent(sound) {
      this.isLoading = false
      this.isPlaying = true
      this._relayEvent('audio-played', sound);
    },
    _relayPausedEvent(sound) {
      this.isPlaying = false
      this._relayEvent('audio-paused', sound);
    },
    _relayEndedEvent(sound) {
      this.isPlaying = false
      this._relayEvent('audio-ended', sound);
    },
    _relayDurationChangedEvent(sound) {
      this._relayEvent('audio-duration-changed', sound);
    },
    _relayPositionChangedEvent(sound) {
      this._relayEvent('audio-position-changed', sound);
    },
    _relayLoadedEvent(sound) {
      this.isLoading = false
      this._relayEvent('audio-loaded', sound);
    },
    _relayLoadingEvent(sound) {
      this._relayEvent('audio-loading', sound);
    },
    _relayPositionWillChangeEvent(sound,  info = {}) {
      this._relayEvent('audio-position-will-change', sound, info);
    },
    _relayWillRewindEvent(sound,  info) {
      this._relayEvent('audio-will-rewind', sound, info);
    },
    _relayWillFastForwardEvent(sound, info) {
      this._relayEvent('audio-will-fast-forward', sound, info);
    },
    _relayMetadataChangedEvent(sound, info) {
      this._relayEvent('audio-metadata-changed', sound, info);
    },
  }
}
