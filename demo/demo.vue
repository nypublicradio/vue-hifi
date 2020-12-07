<template>
  <div>
    <button  @click="play">play howler</button>
    <button  @click="pause">pause howler</button>
    <button  @click="stop">stop howler</button>
    <button  @click="togglePause">togglePause howler</button>
  </div>
</template>

<script>
import vueHifi from '../src/mixins/vue-hifi'

export default {
  mixins: [vueHifi]
}
</script>
