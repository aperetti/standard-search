import {apiGetMenus, Vue} from './config'

export const getMenu = () => {
  return Vue.http({url: apiGetMenus, method: 'GET'})
}
