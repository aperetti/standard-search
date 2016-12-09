import {apiAuth, axios} from './config'

export const getToken = (username, password) => {
  return axios.post(apiAuth, {name: username, password: password})
}

