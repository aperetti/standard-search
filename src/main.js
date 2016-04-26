import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Search from './components/Search'
import VueResource from 'vue-resource'
Vue.use(VueResource)
/* eslint-disable no-new */
var Application = Vue.extend({
  components: { App }
})

Vue.use(VueRouter)

var router = new VueRouter()

router.map({
  '/': { component: Search }
})

router.start(Application, 'body')
