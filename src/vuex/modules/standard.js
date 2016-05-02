import {UPDATE_STANDARD, HYDRATE_MENU, MENU_LOADING, SET_STANDARD_OBJECT, SET_CURRENT_MENU, SET_TOKEN, SET_MENU_STANDARDS} from '../mutation-types'

const state = {
  standard: '', // from standard.file
  standardObject: {},
  menus: [],
  menuStandards: [],
  menuLoading: false,
  currentMenu: [],
  token: {
    token: '',
    expiration: 0
  }
}

const mutations = {
  [UPDATE_STANDARD] (state, newStandard) {
    state.standard = newStandard
  },
  [HYDRATE_MENU] (state, menus) {
    state.menus = menus
  },
  [MENU_LOADING] (state, loading) {
    state.menuLoading = loading
  },
  [SET_STANDARD_OBJECT] (state, standardObject) {
    state.standardObject = standardObject
  },
  [SET_CURRENT_MENU] (state, menuArray) {
    state.currentMenu = menuArray
  },
  [SET_TOKEN] (state, token) {
    state.token = token
  },
  [SET_MENU_STANDARDS] (state, standards) {
    state.menuStandards = standards
  }
}

export default {
  state,
  mutations
}
