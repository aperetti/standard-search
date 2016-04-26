import {UPDATE_STANDARD, GET_MENU} from '../mutation-types'

const state = {
  standard: '',
  menus: []
}

const mutations = {
  [UPDATE_STANDARD] (state, newStandard) {
    state.standard = newStandard
  },
  [GET_MENU] (state, menus) {
    state.menus = menus
  }
}

export default {
  state,
  mutations
}
