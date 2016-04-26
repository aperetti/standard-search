import * as types from './mutation-types'
import {getMenu} from '../api/menu'

export const updateStandard = ({dispatch}, standard) => {
  dispatch(types.UPDATE_STANDARD, standard)
}

export const hydrateMenu = ({dispatch}) => {
  let menu = getMenu
  menu.then((response) => {
    dispatch(types.HYDRATE_MENU, response.data)
  }, (response) => {
    dispatch(types.HYDRATE_MENU, [])
  })
}
