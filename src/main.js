import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMq from 'vue-mq'

import './assets/css/grid.scss'
import './assets/css/transitions.scss'
import './assets/css/style.scss'

Vue.use(VueMq, {
  breakpoints: {
    xsm: 450,
    sm: 600,
    md: 1200,
    lg: Infinity,
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
