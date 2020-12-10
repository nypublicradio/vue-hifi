<template>
  <div>
    <button  @click="playTest">play howler</button>
    <button  @click="pause">pause howler</button>
    <button  @click="stop">stop howler</button>
    <button  @click="togglePause">togglePause howler</button>
  </div>
</template>

<script>
import vueHifi from '../src/mixins/vue-hifi'

export default {
  mixins: [vueHifi],
  methods: {
    playTest () {
      this.play([
        // HLS/m3u8 should play on Safari, but not on Chrome and Firefox, which should play the 2nd url
        'https://hls-live.wnyc.org/wnycfm32/playlist.m3u8',
        'https://fm939.wnyc.org/wnycfm-app'
      ])
    }
  }
}
</script>
