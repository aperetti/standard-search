import {apiAddReferences, Vue} from 'api/config'

export const addReference = (username, password) => {
  return Vue.http({url: apiAddReferences, method: 'POST', data: {name: username, password: password}})
}