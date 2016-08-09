import * as t from '../mutation-types'

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
  mutations
}
