<template>
  <div>
    <button  @click="playTest">play</button>
    <button  @click="pause">pause</button>
    <button  @click="stop">stop</button>
    <button  @click="togglePause">togglePause</button>
    <div>isLoading: {{ isLoading }}</div>
    <div>isPlaying: {{ isPlaying }}</div>
  </div>
</template>

<script>
import vueHifi from '../src/mixins/vue-hifi'

export default {
  mixins: [vueHifi],
  methods: {
    playTest () {
      this.play([
        'https://hls-live.wnyc.org/wnycfm32/playlist.m3u8',
        'https://fm939.wnyc.org/wnycfm-app'
      ])
    }
  }
}
</script>