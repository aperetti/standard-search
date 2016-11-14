import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from './vuex/store'
import App from './App'
import router from './router'
import VueValid from './plugins/vue-valid'

/* eslint-disable no-new */
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueValid)
const app = new Vue({
  router,
  store,
  template: '<App/>',
  components: { App }
})

app.$mount('#app')

