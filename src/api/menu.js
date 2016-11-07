import {apiGetMenus, Vue} from './config'
export const getMenu = (id) => {
  return Vue.http({url: apiGetMenus + '/' + id, method: 'GET'})
}
