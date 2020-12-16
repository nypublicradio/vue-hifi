import HowlerConnection from '../components/howler-connection'
import HlsConnection from '../components/hls-connection'
import vueHifiStore from '../store'

export const EVENT_MAP = [
  { event: 'audio-played', handler: '_relayPlayedEvent' },
  { event: 'audio-paused', handler: '_relayPausedEvent' },
  { event: 'audio-ended', handler: '_relayEndedEvent' },
  { event: 'audio-duration-changed', handler: '_relayDurationChangedEvent' },
  { event: 'audio-position-changed', handler: '_relayPositionChangedEvent' },
  { event: 'audio-loaded', handler: '_relayLoadedEvent' },
  { event: 'audio-loading', handler: '_relayLoadingEvent' },
  { event: 'audio-position-will-change', handler: '_relayPositionWillChangeEvent' },
  { event: 'audio-will-rewind', handler: '_relayWillRewindEvent' },
  { event: 'audio-will-fast-forward', handler: '_relayWillFastForwardEvent' },
  { event: 'audio-metadata-changed', handler: '_relayMetadataChangedEvent' }
]

export const SERVICE_EVENT_MAP = [
  { event: 'current-sound-changed' },
  { event: 'current-sound-interrupted' },
  { event: 'new-load-request' },
  { event: 'pre-load' }
]

const CONNECTIONS = [HowlerConnection, HlsConnection]

export default {
  beforeCreate () {
    this.$store.registerModule('vue-hifi', vueHifiStore)
  },

  computed: {
    isLoading () {
      return this.$store.getters['vue-hifi/getIsLoading'] // eslint-disable-line
    },

    isPlaying () {
      return this.$store.getters['vue-hifi/getIsPlaying'] // eslint-disable-line
    },

    isMobileDevice () {
      return ('ontouchstart' in window)
    },

    volume: {
      get: function () {
        return this.$store.getters['vue-hifi/getVolume'] // eslint-disable-line
      },
      set: function (volume) {
        const sound = this.$store.getters['vue-hifi/getSound'] // eslint-disable-line
        if (sound) {
          sound._setVolume(volume)
        }
        this.$store.commit('vue-hifi/setVolume', volume)
      }
    },

    isMuted: {
      get: function () {
        return this.$store.getters['vue-hifi/getIsMuted'] // eslint-disable-line
      }
    }
  },

  methods: {

    /**
     * Iterate the given array of URLs until a playable URL is found
     */

    _load (urls) {
      if (!(Array.isArray(urls) && urls.length > 0)) {
        return false // error
      }
      for (const urlIndex in urls) {
        for (const connectionIndex in CONNECTIONS) {
          const Connection = CONNECTIONS[connectionIndex]
          if (Connection.canPlay(urls[urlIndex])) {
            return new Connection({
              propsData: {
                urls: [urls[urlIndex]]
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
      if (this.$store.getters['vue-hifi/getIsPlaying']) { // eslint-disable-line
        // trigger current-sound-iterrupted
        this.pause()
      }

      this.$store.commit('vue-hifi/setIsLoading', true)
      const sound = this._load(urls, options)

      if (sound) {
        this._registerEvents(sound)
        this.$store.commit('vue-hifi/setSound', sound)
        this._attemptToPlaySound(sound, options)
      }
    },

    _attemptToPlaySound (sound, options) {
      if (this.isMobileDevice) {
        const touchPlay = () => {
          this.debug('triggering sound play from document touch')
          sound.play()
        }

        document.addEventListener('touchstart', touchPlay, { passive: true })

        // let blockCheck = later(() => {
        //  this.debug(`Looks like the mobile browser blocked an autoplay trying to play sound with url: ${sound.get('url')}`);
        // }, 2000);

        sound.$once('audio-played', () => {
          document.removeEventListener('touchstart', touchPlay)
          // cancel(blockCheck);
        })
      }
      sound.play(options)
    },

    pause () {
      // make sure sound is playing/exists
      this.$store.getters['vue-hifi/getSound'].pause() // eslint-disable-line
    },

    stop () {
      // make sure sound is playing/exists
      this.$store.getters['vue-hifi/getSound'].stop() // eslint-disable-line
    },

    togglePause () {
      // make sure sound is playing/exists
      this.$store.getters['vue-hifi/getSound'].togglePause() // eslint-disable-line
    },

    toggleMute () {
      const isMuted = !(this.$store.getters['vue-hifi/getIsMuted']) // eslint-disable-line
      this.$store.commit('vue-hifi/setIsMuted', isMuted)
      const newVolume = isMuted ? 0 : this.volume
      const sound = this.$store.getters['vue-hifi/getSound'] // eslint-disable-line
      if (sound) {
        sound._setVolume(newVolume)
      }
    },

    /**
    * Register events on a current sound. Audio events triggered on that sound
    * will be relayed and triggered on this service
    *
    * @method _registerEvents
    * @param {Object} sound
    * @private
    */

    _registerEvents (sound) {
      const service = this
      EVENT_MAP.forEach(item => {
        sound.$on(item.event, service[item.handler])
      })

      // Internal event for cleanup
      sound.$on('_will_destroy', () => {
        this._unregisterEvents(sound)
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

    _unregisterEvents (sound) {
      if (!sound) {
        return
      }

      const service = this
      EVENT_MAP.forEach(item => {
        sound.$off(item.event, service[item.handler])
      })
      sound.$off('_will_destroy')
    },

    /**
    * Relays an audio event on the sound to an event on the service
    *
    * @method relayEvent
    * @param {String, Object} eventName, sound
    * @private
    */

    _relayEvent (eventName, sound, info = {}) {
      this.$emit(eventName, sound, info)
    },

    /**
      Named functions so Vue can successfully register/unregister them
    */

    _relayPlayedEvent (sound) {
      this.$store.commit('vue-hifi/setIsLoading', false)
      this.$store.commit('vue-hifi/setIsPlaying', true)
      this._relayEvent('audio-played', sound)
    },
    _relayPausedEvent (sound) {
      this.$store.commit('vue-hifi/setIsPlaying', false)
      this._relayEvent('audio-paused', sound)
    },
    _relayEndedEvent (sound) {
      this.$store.commit('vue-hifi/setIsPlaying', false)
      this._relayEvent('audio-ended', sound)
    },
    _relayDurationChangedEvent (sound) {
      this._relayEvent('audio-duration-changed', sound)
    },
    _relayPositionChangedEvent (sound) {
      this._relayEvent('audio-position-changed', sound)
    },
    _relayLoadedEvent (sound) {
      this.$store.commit('vue-hifi/setIsLoading', false)
      this._relayEvent('audio-loaded', sound)
    },
    _relayLoadingEvent (sound) {
      this._relayEvent('audio-loading', sound)
    },
    _relayPositionWillChangeEvent (sound, info = {}) {
      this._relayEvent('audio-position-will-change', sound, info)
    },
    _relayWillRewindEvent (sound, info) {
      this._relayEvent('audio-will-rewind', sound, info)
    },
    _relayWillFastForwardEvent (sound, info) {
      this._relayEvent('audio-will-fast-forward', sound, info)
    },
    _relayMetadataChangedEvent (sound, info) {
      this._relayEvent('audio-metadata-changed', sound, info)
    }
  }
}
