import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import App from './App'
import Projects from './components/Projects'
import EditStandard from './components/EditStandard'
import StandardView from './components/StandardView'
import Landing from './components/Landing'
import Login from './components/Login'
import {loggedIn} from './api/config'
import {isAdmin} from './api/auth'
import VueValid from './plugins/vue-valid'
import VueTouch from 'vue-touch'
import bus from './bus'
import VueAnimatedList from 'vue-animated-list'

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
Vue.use(VueAnimatedList)
var router = new VueRouter({
  history: true,
  hashbang: false,
  transitionOnLoad: true
})

router.map({
  '/': {
    name: 'landing',
    component: Landing
  },
  '/standard/:standardId': {
    name: 'standard',
    component: StandardView
  },
  '/login': {
    name: 'login',
    component: Login
  },
  '/admin/standard/create': {
    name: 'createStandard',
    component: function (resolve) {
      require(['components/CreateStandard'], resolve)
    }
  },
  '/admin/standard/edit/:standardId': {
    name: 'editStandard',
    component: function (resolve) {
      require(['components/EditStandard'], resolve)
    }
  },
  'user/project/:projectId': {
    name: 'projects',
    component: Projects
  },
  'user/project/': {
    name: 'projectsHome',
    component: Projects
  }
})

router.beforeEach(function (transition) {
  bus.emit('page-reset', 'beforeRoute')
  if (!loggedIn() && transition.to.path.indexOf('/login') === -1) return transition.redirect('/login')
  if (transition.to.path.indexOf('/admin') !== -1) {
    let admin = isAdmin()
    admin.then(function (res) {
      if (res.status === 200) {
        return transition.next()
      } else {
        return transition.redirect('/')
      }
    }, function (res) {
      return transition.abort()
    })
  } else {
    if (transition.to.path.indexOf('/login') !== -1 && loggedIn()) return transition.abort()

    return transition.next()
  }
})

router.start(Application, 'body')
