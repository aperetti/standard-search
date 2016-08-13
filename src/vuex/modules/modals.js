import * as t from '../mutation-types'

const state = {
  CreateProject: {
    enabled: false
  }
}

const mutations = {
  [t.SET_CREATEPROJECT] (state, enable) {
    state.CreateProject.enabled = enable
  }
}

export default {
  state,
  mutations
}
