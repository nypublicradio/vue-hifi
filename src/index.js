import vueHifi from './mixins/vue-hifi'

export default {
  install (Vue, options) {
    Vue.mixin('vue-hifi', vueHifi)
  }
}
