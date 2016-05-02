import store from '../vuex/store'
export const apiUrl = 'http://45.56.92.153:8080/api/'
export const apiAuthUrl = apiUrl + 'authenticate'
export const apiMenuUrl = apiUrl + 'menu'
export const apiStandardUrl = (standard) => {
  return apiUrl + 'standard/' + standard
}
export const apiStandardsByMenuUrl = apiUrl + 'standardsByMenu'

export const token = () => {
  return store.state.standard.token.token
}
