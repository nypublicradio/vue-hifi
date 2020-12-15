import Vue from 'vue'
import App from './App'
import store from './store'

// turns off the (annoying) production tip you see in the console
Vue.config.productionTip = false

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')
