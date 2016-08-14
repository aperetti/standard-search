import * as t from '../mutation-types'

const state = {
  CreateProject: {
    enabled: false
  }
}

const mutations = {
  [t.SET_CREATEPROJECT] (state, enable) {
    state.CreateProject.enabled = enable
  },
  [t.CLOSE_MODALS] (state) {
    for (var key in state) {
      if (state[key].enabled) {
        state[key].enabled = false
      }
    }
  }
}

export default {
  state,
  mutations
}
