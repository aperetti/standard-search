import VueRouter from 'vue-router'
import StandardView from 'components/StandardView'
import Landing from 'components/LandingPage'
import Projects from 'components/Projects'
import Login from './components/Login'
import {loggedIn} from './api/config'
import bus from './bus'
import store from 'src/vuex/store'

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
      require(['components/ManageStandard'], resolve)
    }
  },
  {
    path: '/admin/standard/edit/:standardId',
    name: 'editStandard',
    component: function (resolve) {
      require(['components/ManageStandard'], resolve)
    }
  },
  {
    path: '/admin/settings',
    name: 'adminSettings',
    component: function (resolve) {
      require(['./components/AdminSettings'], resolve)
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
    if (store.state.user.roles.indexOf('Admin') !== -1) {
      return next()
    } else {
      return next('/')
    }
  } else {
    if (to.fullPath.indexOf('/login') !== -1 && loggedIn()) return next(false)
    return next()
  }
}

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach(before)
export default router
