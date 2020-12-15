import HowlerConnection from '../components/howler-connection'
import HlsConnection from '../components/hls-connection'
import state from '../store/vue-hifi'

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
  created () {
    this.$store.registerModule("vue-hifi", state);
  },

  computed: {
    isLoading () {
      return this.$store.getters['getIsLoading']
    },

    isPlaying () {
      return this.$store.getters['getIsPlaying']
    },

    isMobileDevice () {
      return ('ontouchstart' in window)
    }
  },

  props: {
    isMuted: {
      type: Boolean,
      default: false
    },

    
    defaultVolume: {
      type: Number,
      default: 1.0
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

    _load (urls) {
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
      if (this.$store.getters['getIsPlaying']) {
        // trigger current-sound-iterrupted
        this.pause()
      }

      this.$store.commit('setIsLoading', true)
      let sound = this._load(urls, options)

      if (sound) {
        this._registerEvents(sound)
        this.$store.commit('setSound', sound)
        this._attemptToPlaySound(sound, options)
      }
    },

    _attemptToPlaySound(sound, options) {
      if (this.isMobileDevice) {
        let touchPlay = ()=> {
          this.debug(`triggering sound play from document touch`);
          sound.play();
        };

        document.addEventListener('touchstart', touchPlay, { passive: true });

        //let blockCheck = later(() => {
        //  this.debug(`Looks like the mobile browser blocked an autoplay trying to play sound with url: ${sound.get('url')}`);
        //}, 2000);

        sound.$once('audio-played', () => {
          document.removeEventListener('touchstart', touchPlay);
          //cancel(blockCheck);
        });
      }
      sound.play(options)
    },

    pause () {
      // make sure sound is playing/exists
      this.$store.getters['getSound'].pause()
    },

    stop () {
      // make sure sound is playing/exists
      this.$store.getters['getSound'].stop()
    },

    togglePause () {
      // make sure sound is playing/exists
      this.$store.getters['getSound'].togglePause()
    },

    toggleMute () {

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
      this.$store.commit('setIsLoading', false)
      this.$store.commit('setIsPlaying', true)
      this._relayEvent('audio-played', sound);
    },
    _relayPausedEvent(sound) {
      this.$store.commit('setIsPlaying', false)
      this._relayEvent('audio-paused', sound);
    },
    _relayEndedEvent(sound) {
      this.$store.commit('setIsPlaying', false)
      this._relayEvent('audio-ended', sound);
    },
    _relayDurationChangedEvent(sound) {
      this._relayEvent('audio-duration-changed', sound);
    },
    _relayPositionChangedEvent(sound) {
      this._relayEvent('audio-position-changed', sound);
    },
    _relayLoadedEvent(sound) {
      this.$store.commit('setIsLoading', false)
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
