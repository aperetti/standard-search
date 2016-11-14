import * as t from '../mutation-types'
import {getMenu} from 'api/menu'

const actions = {
  hydrateMenu ({commit}) {
    let menu = getMenu()
    commit(t.MENU_LOADING, true)
    menu.then((response) => {
      commit(t.HYDRATE_MENU, response.data)
      commit(t.MENU_LOADING, false)
    }, (response) => {
      console.log('Failed Hydrate Menu')
      commit(t.MENU_LOADING, false)
      commit(t.HYDRATE_MENU, [])
    })
  },
  menuLoading ({commit}, loading) {
    loading ? commit(t.MENU_LOADING, true) : commit(t.MENU_LOADING, false)
  },
  setToken ({commit}, token) {
    commit(t.SET_TOKEN, token)
  },
  setActiveMenu ({commit}, menu) {
    commit(t.SET_ACTIVE_MENU, menu)
  },
  logout ({commit}) {
    let token = {token: '', expiration: 0}
    window.localStorage.setItem('token', '')
    window.localStorage.setItem('expiration', 0)
    window.localStorage.setItem('username', '')
    commit(t.SET_TOKEN, token)
  },
  login ({commit}, response) {
    window.localStorage.setItem('token', response.data.token)
    window.localStorage.setItem('expiration', response.data.expires)
    window.localStorage.setItem('username', response.data.username)
    let token = {token: response.data.token, expiration: response.data.expires}
    commit(t.SET_TOKEN, token)
  },
  setCreateProject ({commit}, set) {
    commit(t.SET_CREATEPROJECT, set)
  },
  closeModals ({commit}) {
    commit(t.CLOSE_MODALS)
  }
}

const state = {
  activeMenu: '',
  menus: [],
  menuLoading: false,
  token: {
    token: '',
    expiration: 0
  }
}

const mutations = {
  [t.HYDRATE_MENU] (state, menus) {
    state.menus = menus
  },
  [t.MENU_LOADING] (state, loading) {
    state.menuLoading = loading
  },
  [t.SET_TOKEN] (state, token) {
    state.token = token
  },
  [t.SET_ACTIVE_MENU] (state, menu) {
    state.activeMenu = menu
  }
}

export default {
  state,
  mutations,
  actions
}
