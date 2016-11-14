import * as t from '../mutation-types'

const actions = {
  createAlert ({commit}, alert) {
    alert.id = Math.ceil(Math.random() * 100000)
    commit(t.CREATE_ALERT, alert)
    setTimeout(() => commit(t.CLOSE_ALERT, alert.id), alert.delay || 3000)
  },
  closeAlert ({commit}, id) {
    commit(t.CLOSE_ALERT, id)
  },
  closeAll ({commit}) {
    commit(t.CLOSE_ALERT)
  }
}

const state = []

const mutations = {
  [t.CREATE_ALERT] (state, alert) {
    state.push(alert)
  },
  [t.CLOSE_ALERT] (state, id) {
    function findId (id) {
      for (var i in state) {
        if (state[i].id === id) return i
      }
      return -1
    }
    var idx = findId(id)
    if (idx !== -1) {
      state.splice(idx, 1)
    }
  },
  [t.CLOSE_ALL] (state) {
    state = []
  }
}

export default {
  state,
  mutations,
  actions
}
