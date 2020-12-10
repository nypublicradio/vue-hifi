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

    setup () {
      let sound = this
      this.$data._howl = new Howl({
        src: sound.urls,
        autoplay: false,
        preload:  true,
        html5:    true, // force native audio
        volume:   1,
        format: ['aac'], // needed for missing file extension
        onload: function() {
          sound.$set(sound, 'isPlaying', false)
        },
        onplay: function() {
          sound.$set(sound, 'isPlaying', true)
        },
        onpause: function() {
          sound.$set(sound, 'isPlaying', false)
        },
        onend: function() {
          sound.$set(sound, 'isPlaying', false)
        },
        onstop: function() {
          sound.$set(sound, 'isPlaying', false)
        },
        onloaderror: function(id, error) {
          console.log(error)
          console.log(id)
          sound.$set(sound, 'isPlaying', false)
        },
        onseek: function() {

        }
      })
    },

    play (/* { position } = {} */ ) {
      if (!this.$data._howl) {
        this.setup()
      }
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
