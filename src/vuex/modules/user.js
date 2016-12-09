import * as t from '../mutation-types'

const actions = {
  setUser ({commit}, user) {
    commit(t.SET_USER, user)
  },
  clearUser ({commit}) {
    commit(t.CLEAR_USER)
  },
  hydrateUser ({commit}, user) {
    commit(t.SET_USER, user)
  },
  logout ({commit}) {
    window.localStorage.clear()
    commit(t.CLEAR_USER)
  },
  login ({commit}, res) {
    window.localStorage.setItem('token', res.data.token)
    window.localStorage.setItem('expiration', res.data.expires)
    window.localStorage.setItem('username', res.data.username)
    window.localStorage.setItem('roles', JSON.stringify(res.data.roles))
    console.log(res)
    let user = {
      roles: res.data.roles,
      token: {
        token: res.data.token,
        expiration: res.data.expires
      },
      name: res.data.username
    }
    commit(t.SET_USER, user)
  }
}

const state = {
  roles: [],
  token: {token: null, expiration: 0},
  name: ''
}

const mutations = {
  [t.SET_USER] (state, user) {
    state.roles = user.roles
    state.token = user.token
    state.name = user.name
  },
  [t.CLEAR_USER] (state) {
    state.roles = []
    state.token = {token: null, expiration: 0}
    state.name = ''
  }
}

const getters = {
  isAdmin: (state) => state.roles.indexOf('Admin') !== -1
}

export default {
  state,
  mutations,
  actions,
  getters
}
