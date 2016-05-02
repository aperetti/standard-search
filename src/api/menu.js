import {apiMenuUrl, token} from './config'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

export const getMenu = () => {
  return Vue.http({url: apiMenuUrl, method: 'GET', params: {token: token}})
}

