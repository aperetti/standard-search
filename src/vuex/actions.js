import * as types from './mutation-types'
import {getMenu} from '../api/menu'
import {getStandard, getStandardsByMenu} from '../api/standard'

export const updateStandard = ({dispatch}, standard) => {
  dispatch(types.UPDATE_STANDARD, standard)
  let standardObject = getStandard(standard)
  standardObject.then((response) => {
    dispatch(types.SET_STANDARD_OBJECT, response.data)
    dispatch(types.SET_CURRENT_MENU, response.data.menu)
  }, (response) => {
    console.log('Update Standard Failed')
  })
}

export const hydrateMenu = ({dispatch}) => {
  let menu = getMenu()
  menu.then((response) => {
    dispatch(types.HYDRATE_MENU, response.data)
  }, (response) => {
    console.log('Failed Hydrate Menu')
    dispatch(types.HYDRATE_MENU, [])
  })
}

export const menuLoading = ({dispatch}, loading) => {
  loading ? dispatch(types.MENU_LOADING, true) : dispatch(types.MENU_LOADING, false)
}

export const setToken = ({dispatch}, token) => {
  dispatch(types.SET_TOKEN, token)
}

export const setCurrentMenu = ({dispatch}, currentMenu) => {
  dispatch(types.SET_CURRENT_MENU, currentMenu)
  let standards = getStandardsByMenu(currentMenu)
  standards.then((response) => {
    dispatch(types.SET_MENU_STANDARDS, response.data)
  }, (response) => {
    console.log('Failed to retrieve standards')
    dispatch(types.SET_MENU_STANDARDS, [])
  })
}
