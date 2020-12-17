This repo is an initial attempt at converting `ember-hifi` to `vue-hifi`.

### Run Development Server

`npm run dev`

### Install 

`npm install --save vue-hifi``

### Overview

`vue-hifi`  focuses on simple stream playback of HLS and other formats.

It uses two playback libraries: HLS.js and Howler.js. When using Howler.js, it forces Howler’s Native Audio option, as opposed to Web Audio extensions, which is Howler’s default. This way, we don’t have to implement Native Audio ourselves, and can use Howler’s Web Audio in the future for on-demand.

`vue-hifi` is implemented as a mixin that can be added to a Vue component. It takes in a list of URLs through the `play` method and plays the first URL with a format supported by the current browser, like so:

```
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
```

Right now, it tries Native Audio through Howler.js first, and then HLS.js. In this scenario, the following playback libraries will be used when playing an HLS stream:

- Safari Desktop: native Audio through Howler
- Chrome Desktop: HLS.js (Chrome doesn’t support HLS on Native Audio default)
- Firefox Desktop: HLS.js (Firefox doesn’t support HLS on Native Audio by default)



