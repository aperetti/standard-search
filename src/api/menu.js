import {apiGetMenus, apiCreateMenu, Vue} from './config'
export const getMenu = (id) => {
  return Vue.http({url: apiGetMenus + '/' + id, method: 'GET'})
}

export const createMenu = (menu) => {
  return Vue.http({url: apiCreateMenu, body: menu, method: 'POST'})
}
