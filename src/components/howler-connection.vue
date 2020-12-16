<script>
import { Howl } from 'howler'
import BaseConnection from '../components/base-connection'
import { getMimeType } from '../utils/mime-types'

const HowlerConnection = BaseConnection.extend({

  data () {
    return {
      _howl: null
    }
  },

  methods: {

    _onload () {
      this.$emit('audio-loaded', this)
      this.$emit('audio-ready', this)
    },

    _onplay () {
      this.$emit('audio-played', this)
    },

    _onpause () {
      this.$emit('audio-paused', this)
    },

    _onend: function () {
      this.$emit('audio-ended', this)
    },

    _onstop: function () {
      this.$emit('audio-paused', this)
    },

    _onloaderror: function (id, error) {
      this.$emit('audio-load-error', error, id)
    },

    _onseek: function () {
      this.$emit('audio-position-changed', this._currentPosition())
    },

    _setup () {
      const sound = this
      this.$data._howl = new Howl({
        src: sound.urls,
        autoplay: false,
        preload: true,
        html5: true, // force native audio
        volume: 1,
        format: ['aac', 'mp3'], // needed for missing file extension
        onload: this._onload,
        onplay: this._onplay,
        onpause: this._onpause,
        onend: this._onend,
        onstop: this._onstop,
        onloaderror: this._onloaderror,
        onseek: this._onseek
      })
    },

    play (/* { position } = {} */) {
      this.$data._howl.play()
    },

    pause () {
      this.$data._howl.pause()
    },

    stop () {
      this.$data._howl.stop()
    },

    _audioDuration () {

    },

    _currentPosition () {

    },

    _setPosition () {

    },

    _setVolume (volume) {
      this.$data._howl.volume(volume / 100)
    },

    teardown () {

    }
  }
})

HowlerConnection.canPlay = function (url) {
  if (typeof url === 'string') {
    const mimeType = getMimeType(url)

    if (!mimeType) {
      console.warn(`Could not determine mime type for ${url}`)
      console.warn('Attempting to play urls with an unknown mime type can be bad for performance.')
      return true
    } else {
      const audio = new Audio()
      return audio.canPlayType(mimeType) !== ''
    }
  } else {
    throw new Error('[vue-hifi] #URL must be a string or object with a mimeType property')
  }
}

export default HowlerConnection
</script>
