This repo is an initial attempt at converting `ember-hifi` to `vue-hifi`.

It focuses on simple stream playback of HLS and other formats. I’ve stubbed out methods like `rewind` and `fastForward`, but these will need to be implemented and tested at a later time.

It uses two playback libraries: HLS.js and Howler.js. When using Howler.js, it forces Howler’s Native Audio option, as opposed to Web Audio extensions, which is Howler’s default. This way, we don’t have to implement Native Audio ourselves, and can use Howler’s Web Audio in the future for on-demand.

`vue-hifi` is implemented as a mixin that can be added to a Vue component. It takes in a list of URLs through the `play` method and plays the first URL with a format supported by the current browser. You can run the following example from the root directory via `vue serve demo/demo.vue`:

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

I’m still working on a few Vue-related issues, with which I could use some suggestions/help:

1. I added a Vuex store to share playback state across component instances, so that tapping different play/pause buttons on different parts of the page will control the same audio instance. Since I did this, though, I’m seeing a few issues:
    1. I can’t figure out how to add the store to the demo in `./demo`, so it doesn’t work when I run `vue serve demo/demo.vue`
    2. I’m seeing a stack error that seems to be related to storing a Vue component representing the currently playing audio in the Vuex store. From my research it seems like Vuex isn’t intended to store complex objects, so I’m wondering what/where the best place to store this object is.
2. In my initial integration tests with `wnyc-3000-vue`, I’m seeing eslint warnings in the console. I’d like to configure `vue-hifi` to use eslint but my first few attempts haven’t fixed the warnings.
3. I’m still working out some mobile issues that revolve around the user needing to click `play` twice to get the audio to play due to some restrictions on autoplaying audio. `ember-hifi` had some workarounds that I’m trying to emulate while also keeping things simple.

### Run Development Server

`npm run dev`
