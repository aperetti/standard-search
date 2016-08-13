import * as types from './mutation-types'
import {getMenu} from '../api/menu'

export const hydrateMenu = ({dispatch}) => {
  let menu = getMenu()
  dispatch(types.MENU_LOADING, true)
  menu.then((response) => {
    dispatch(types.HYDRATE_MENU, response.data)
    dispatch(types.MENU_LOADING, false)
  }, (response) => {
    console.log('Failed Hydrate Menu')
    dispatch(types.MENU_LOADING, false)
    dispatch(types.HYDRATE_MENU, [])
  })
}

export const menuLoading = ({dispatch}, loading) => {
  loading ? dispatch(types.MENU_LOADING, true) : dispatch(types.MENU_LOADING, false)
}

export const setToken = ({dispatch}, token) => {
  dispatch(types.SET_TOKEN, token)
}

export const setActiveMenu = ({dispatch}, menu) => {
  dispatch(types.SET_ACTIVE_MENU, menu)
}

export const logout = ({dispatch}) => {
  let token = {token: '', expiration: 0}
  window.localStorage.setItem('token', '')
  window.localStorage.setItem('expiration', 0)
  window.localStorage.setItem('username', '')
  dispatch(types.SET_TOKEN, token)
}

export const login = ({dispatch}, response) => {
  window.localStorage.setItem('token', response.data.token)
  window.localStorage.setItem('expiration', response.data.expires)
  window.localStorage.setItem('username', response.data.username)
  let token = {token: response.data.token, expiration: response.data.expires}
  dispatch(types.SET_TOKEN, token)
}

export const setCreateProject = ({dispatch}, set) => {
  dispatch(types.SET_CREATEPROJECT, set)
}
