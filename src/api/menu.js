import {apiGetMenus, apiCreateMenu, apiDeleteMenu, Vue} from './config'
export const getMenu = (id) => {
  return Vue.http({url: apiGetMenus + '/' + id, method: 'GET'})
}

export const createMenu = (menu) => {
  return Vue.http.post(apiCreateMenu, menu)
}

export const deleteMenu = (menuId) => {
  return Vue.http.delete(apiDeleteMenu + '/' + menuId)
}
