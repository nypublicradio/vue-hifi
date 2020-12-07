import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Default from './layouts/Default'
import VueRouter from 'vue-router'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueRouter)
Vue.use(VueCompositionApi)

// layouts
Vue.component('default-layout', Default)

// turns off the (annoying) production tip you see in the console
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
