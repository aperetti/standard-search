import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Search from './components/Search'

/* eslint-disable no-new */
var Application = Vue.extend({
  components: { App }
})

Vue.use(VueRouter)

var router = new VueRouter({
  history: true,
  hashbang: false
})

router.map({
  '/search': {
    name: 'search',
    component: Search
  },
  '/search/:standard': {
    component: Search
  }
})

router.redirect({
  '/': '/search'
})

router.start(Application, 'body')
