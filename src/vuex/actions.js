import * as types from './mutation-types'
import {getMenu} from '../api/menu'

export const updateStandard = ({dispatch}, standard) => {
  dispatch(types.UPDATE_STANDARD, standard)
}

export const hydrateMenu = ({dispatch}) => {
  dispatch(types.GET_MENU, getMenu)
}
