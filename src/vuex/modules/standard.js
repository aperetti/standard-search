import * as t from '../mutation-types'

const actions = {
  menuLoading ({commit}, loading) {
    loading ? commit(t.MENU_LOADING, true) : commit(t.MENU_LOADING, false)
  },
  setToken ({commit}, token) {
    commit(t.SET_TOKEN, token)
  },
  setActiveMenu ({commit}, menu) {
    commit(t.SET_ACTIVE_MENU, menu)
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
  menuLoading: false
}

const mutations = {
  [t.HYDRATE_MENU] (state, menus) {
    state.menus = menus
  },
  [t.MENU_LOADING] (state, loading) {
    state.menuLoading = loading
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
