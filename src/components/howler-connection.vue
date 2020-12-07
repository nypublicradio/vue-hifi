<script>
import { Howl } from 'howler'
import BaseConnection from '../components/base-connection'

export default BaseConnection.extend({
  data () {
    return {
      _howl: null
    }
  },

  methods: {
    play (/* { position } = {} */ ) {
      if (!this.$data._howl) {
        let sound = this
        this.$data._howl = new Howl({
          src: [
            //'https://hls-live.wnyc.org/wnycfm32/playlist.m3u8'// ,
            'https://fm939.wnyc.org/wnycfm-app'
          ],
          volume: 1.0,
          html5: true, // force native audio
          loop: false,
          preload: true,
          autoplay: false,
          mute: false,
          rate: 1.0,
          format: ['mp3', 'aac'],
          // xhrWithCredentials: false,
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
          onloaderror: function(/* id, error */) {
            sound.$set(sound, 'isPlaying', false)
          },
          onseek: function() {

          }
        })
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
</script>
