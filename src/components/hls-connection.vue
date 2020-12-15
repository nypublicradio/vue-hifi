<script>
import BaseConnection from '../components/base-connection'
import HLS from 'hls.js'
import { getMimeType } from '../utils/mime-types'

/**
 * This class connects with HLS.js to create sounds.
 * 
 * @class HlsConnection
 * @extends BaseConnection
 */
let HlsConnection = BaseConnection.extend({

  data () {
    return {
      loaded: false,
      mediaRecoveryAttempts: 0,
      id3TagMetadata: null,
      video: null,
      hls: null
    }
  },

  methods: {

    _setup () {
      this.hls = new HLS({debug: false, startFragPrefetch: true})
      this.video = document.createElement('video')

      this.hls.attachMedia(this.video)
      this._setupHlsEvents(this.hls)
      this._setupPlayerEvents(this.video)
    },

    _setupHlsEvents (hls) {
      hls.on(HLS.Events.MEDIA_ATTACHED, () => {
        console.log('media attached');
        hls.loadSource(this.urls[0])

        hls.on(HLS.Events.MANIFEST_PARSED, (e, data) => {
          console.log(`manifest parsed and loaded, found ${data.levels.length} quality level(s)`);
          this.manifest =data
        })

        hls.on(HLS.Events.LEVEL_LOADED, (e, data) => {
          console.log(`level ${data.level} loaded`);
          this.live = data.details.live
          this._checkIfAudioIsReady()
        })

        hls.on(HLS.Events.AUDIO_TRACK_LOADED, () => {
          console.log('audio track loaded');
          this._checkIfAudioIsReady()
        })

        hls.on(HLS.Events.ERROR, (e, data) => this._onHLSError(e, data))

        var self = this
        hls.on(HLS.Events.FRAG_CHANGED, (e, f) => {
          let newId3TagMetadata = {
            title: f.frag.title
          }

          if (JSON.stringify(self.id3TagMetadata) !== JSON.stringify(newId3TagMetadata)) {
            console.log('hls metadata changed');
            this.$emit('audio-metadata-changed', {
              old: self.id3TagMetadata,
              new: newId3TagMetadata
            })
            self.id3TagMetadata = newId3TagMetadata
          }
        })
      })
    },

    _setupPlayerEvents (video) {
      video.addEventListener('playing', () => {
        if (this.loaded) {
          this.$emit('audio-played', this)
        } else {
          this._signalAudioIsReady()
        }
        //if (!this.loaded) {
        //  this._signalAudioIsReady()
        //}
        //this.$emit('audio-played', this)
      })

      video.addEventListener('pause',           ()  => this.$emit('audio-paused', this))
      video.addEventListener('durationchange',  ()  => this.$emit('audio-duration-changed', this))
      video.addEventListener('seeked',          ()  => this.$emit('audio-position-changed', this))
      video.addEventListener('progress',        ()  => this.$emit('audio-loading'))
      video.addEventListener('error',           (e) => this._onVideoError(e))
    },

    _checkIfAudioIsReady() {
      if (!this.loaded) {
        // The only reliable way to check if this thing is actually ready
        // is to play it. If we get a play signal we're golden, but if we
        // get an error, we're outta here

        console.log('Testing if audio is ready');
        this.video.volume = 1
        this.video.play()
      }
    },

    _signalAudioIsReady() {
      console.log('Test succeeded, signaling audio-ready');
      this.loaded = true
      //this.video.pause()
      this.$emit('audio-ready')
    },

    _onVideoError(e) {
      switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
          console.log("video element error: playback aborted");
          this._giveUpAndDie("unknown error")
          break
        case e.target.error.MEDIA_ERR_NETWORK:
          console.log("video element error: network error");
          this._giveUpAndDie("Network error caused download to fail")
          break
        case e.target.error.MEDIA_ERR_DECODE:
          console.log("video element error: decoding error");
          this._tryToRecoverFromMediaError(e.target.error.MEDIA_ERR_DECODE)
          break
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.log("video element error: source format not supported");
          this._giveUpAndDie("audio source format is not supported")
          break
        default:
          this._giveUpAndDie("unknown error")
          break
      }
    },

    _onHLSError (error, data) {
      if (data.fatal) {
        switch(data.type) {
          case HLS.ErrorTypes.NETWORK_ERROR:
            console.log(data)
            this._giveUpAndDie(`${data.details}`)
            break
          case HLS.ErrorTypes.MEDIA_ERROR:
            this._tryToRecoverFromMediaError(`${data.details}`)
            break
          default:
            this._giveUpAndDie(`${data.details}`)
            break
        }
      }
    },

    _tryToRecoverFromMediaError (error) {
      let mediaRecoveryAttempts = this.mediaRecoveryAttempts
      let hls = this.hls

      switch(mediaRecoveryAttempts) {
        case 0:
          console.log(`First attempt at media error recovery for error: ${error}`);
          hls.recoverMediaError()
          break
        case 1:
          console.log(`Second attempt at media error recovery: switching codecs for error: ${error}`);
          hls.swapAudioCodec()
          hls.recoverMediaError()
          break
        case 2:
          console.log(`We tried our best and we failed: ${error}`);
          this._giveUpAndDie(error)
          break
      }

      this.mediaRecoveryAttempts++
    },

    _giveUpAndDie (error) {
      this.hls.destroy()
      this.$emit('audio-load-error', error)
    },

    play (/* { position } = {} */ ) {
      if (!this.video.src) {
        this._setup() // the stream was stopped before
      }

      this.video.play()

      if (this.loadStopped) {
        this.hls.startLoad()
        this.loadStopped = false
      }
    },

    pause () {
      this.video.pause()
      this.hls.stopLoad()
      this.loadStopped = true
    },

    stop () {
      this.pause();
      this.video.removeAttribute('src')
    },

    _audioDuration () {
      if (this.live) {
        return Infinity
      } else {
        return this.video.duration * 1000
      }
    },

    _currentPosition () {
      return this.video.currentTime * 1000
    },

    _setPosition (position) {
      this.video.currentTime = (position / 1000)
      return position
    },

    _setVolume (volume) {
      this.video.volume = (volume/100)
    },

    teardown () {
      this.hls.destroy()
    }
  }
})

HlsConnection.acceptMimeTypes = [ 'application/vnd.apple.mpegurl' ]

HlsConnection.canUseConnection = function ( /* audioUrl */) {
  return HLS.isSupported()
}

HlsConnection.canPlay = BaseConnection.canPlay
HlsConnection.canPlayMimeType = BaseConnection.canPlayMimeType

HlsConnection.canPlay = function (url) {
  if (!HLS.isSupported) {
    return false
  }

  if (typeof url === 'string') {
    let mimeType = getMimeType(url)

    if (!mimeType) {
      console.warn(`Could not determine mime type for ${url}`)
      console.warn(`Attempting to play urls with an unknown mime type can be bad for performance.`)
      return true
    } else {
      return BaseConnection.canPlayMimeType(mimeType)
    }
  } else {
    throw new Error('[vue-hifi] #URL must be a string or object with a mimeType property')
  }
}

export default HlsConnection
</script>
