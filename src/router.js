import VueRouter from 'vue-router'
import Projects from './components/Projects'
import StandardView from './components/StandardView'
import Landing from './components/Landing'
import Login from './components/Login'
import {loggedIn} from './api/config'
import {isAdmin} from './api/auth'
import bus from './bus'

var routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/standard/:standardId',
    name: 'standard',
    component: StandardView
  },
  {
    path: '/admin/standard/create',
    name: 'createStandard',
    component: function (resolve) {
      require(['components/CreateStandard'], resolve)
    }
  },
  {
    path: '/admin/standard/edit/:standardId',
    name: 'editStandard',
    component: function (resolve) {
      require(['components/CreateStandard'], resolve)
    }
  },
  {
    path: '/admin/settings',
    name: 'adminSettings',
    component: function (resolve) {
      require(['components/AdminSettings'], resolve)
    }
  },
  {
    path: '/user/project/:projectId',
    name: 'projects',
    component: Projects
  },
  {
    path: '/user/project/',
    name: 'projectsHome',
    component: Projects
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

function before (to, from, next) {
  bus.emit('page-reset', 'beforeRoute')
  if (!loggedIn() && !to.fullPath.indexOf('/login') === -1) return next('/login')
  if (to.fullPath.indexOf('/admin') !== -1) {
    isAdmin().then(function (res) {
      if (res.status === 200) {
        return next()
      } else {
        return next('/')
      }
    }, function (res) {
      return next(false)
    })
  } else {
    if (to.fullPath.indexOf('/login') !== -1 && loggedIn()) return next(false)
    console.log('going to next')
    return next()
  }
}

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach(before)
export default router

