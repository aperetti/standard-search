import {apiAuthUrl} from './config'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

export const getToken = (username, password) => {
  return Vue.http({url: apiAuthUrl, method: 'POST', data: {name: username, password: password}})
}
