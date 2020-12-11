<script>
import { Howl } from 'howler'
import BaseConnection from '../components/base-connection'

let HowlerConnection = BaseConnection.extend({

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

    _onend: function() {
      this.$emit('audio-ended', this)
    },

    _onstop: function() {
      this.$emit('audio-paused', this)
    },

    _onloaderror: function( id, error ) {
      this.$emit('audio-load-error', error, id)
    },

    _onseek: function() {
      this.$emit('audio-position-changed', this._currentPosition())
    },

    _setup () {
      let sound = this
      this.$data._howl = new Howl({
        src: sound.urls,
        autoplay: false,
        preload:  true,
        html5:    true, // force native audio
        volume:   1,
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

    play (/* { position } = {} */ ) {
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

    _setVolume () {

    },

    teardown () {

    }
  }
})

HowlerConnection.canPlayMimeType = function (mimeType) {
  let audio = new Audio()
  return audio.canPlayType(mimeType) !== ""
}

export default HowlerConnection
</script>
