import {apiAuth, apiIsAdmin, Vue} from './config'

export const getToken = (username, password) => {
  return Vue.http({url: apiAuth, method: 'POST', data: {name: username, password: password}})
}

export const isAdmin = () => {
  return Vue.http({url: apiIsAdmin, method: 'GET'})
}
