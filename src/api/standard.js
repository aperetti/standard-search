import {apiStandardUrl, apiStandardsByMenuUrl, token} from './config'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

export const getStandard = (standard) => {
  return Vue.http({url: apiStandardUrl(standard), method: 'GET', params: {token: token}})
}

export const getStandardsByMenu = (menu) => {
  return Vue.http({url: apiStandardsByMenuUrl, method: 'POST', params: {token: token}, data: {'menu': menu}})
}
