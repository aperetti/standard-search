import {apiMenuUrl} from './config'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
export const getMenu = Vue.http({url: apiMenuUrl, method: 'GET', params: {token: window.localStorage.getItem('token')}})
