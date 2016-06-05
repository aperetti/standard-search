import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import App from './App'
import StandardView from './components/StandardView'
import CreateStandard from './components/CreateStandard'
import Login from './components/Login'
import {loggedIn} from './api/config'
import {isAdmin} from './api/auth'
import VueValid from './plugins/vue-valid'
import VueTouch from 'vue-touch'

/* eslint-disable no-new */
var Application = Vue.extend({
  components: { App }
})

VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})

Vue.use(VueTouch)
Vue.use(VueValidator)
Vue.use(VueRouter)
Vue.use(VueValid)

var router = new VueRouter({
  history: true,
  hashbang: false,
  transitionOnLoad: true
})

router.map({
  '/search': {
    name: 'search',
    component: StandardView
  },
  '/search/:standard': {
    component: StandardView
  },
  '/login': {
    name: 'login',
    component: Login
  },
  '/admin/standard/create': {
    name: 'createStandard',
    component: CreateStandard
  }
})

router.redirect({
  '/': '/search'
})

router.beforeEach(function (transition) {
  if (!loggedIn() && !transition.to.path.includes('/login')) {
    transition.redirect('/login')
  } else if (transition.to.path.includes('/admin')) {
    let admin = isAdmin()
    admin.then(function (res) {
      if (res.status === 200) {
        transition.next()
      } else {
        transition.redirect('/')
      }
    }, function (res) {
      transition.abort()
    })
  } else {
    transition.next()
  }
})

router.start(Application, 'body')
