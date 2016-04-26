import {UPDATE_STANDARD, HYDRATE_MENU} from '../mutation-types'

const state = {
  standard: '',
  menus: []
}

const mutations = {
  [UPDATE_STANDARD] (state, newStandard) {
    state.standard = newStandard
  },
  [HYDRATE_MENU] (state, menus) {
    state.menus = menus
  }
}

export default {
  state,
  mutations
}
