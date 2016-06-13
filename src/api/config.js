import store from '../vuex/store'
import Vue from 'vue'
import VueResource from 'vue-resource'
import {setToken} from '../vuex/actions'

Vue.use(VueResource)
Vue.http.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')

// The following intercepts any request and updates the Authorization token
Vue.http.interceptors.push({
  request: (request) => {
    request.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token')
    return request
  }
})

export {Vue}

export const domainBase = 'https://photoredux.com/'
export const apiBase = domainBase + 'api/'
export const elasticSearch = domainBase + 'standard/_search'
export const apiAuth = apiBase + 'authenticate'
export const apiStandardsBase = apiBase + 'standards/'
export const apiAdminBase = apiBase + 'admin/'
export const apiGetMenus = apiStandardsBase + 'menu'

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const apiLookupStandardRecord = (standard) => {
  return apiStandardsBase + 'lookup/' + standard
}

export const apiGetStandardHtml = (standard) => {
  return apiStandardsBase + 'html/' + standard
}

export const apiGetStandardPdf = (standard) => {
  return apiStandardsBase + 'pdf/' + standard
}

// Used to determine if the current User is admin. Should only be used to affect display. All authentication
// should take place on the server.
export const apiIsAdmin = apiAdminBase + 'is_admin'
export const apiValidStandard = apiStandardsBase + 'valid_standard/'

export const apiGetStandardsFromMenu = apiStandardsBase + 'from_menu/'

export const token = () => {
  return store.state.standard.token.token
}

export const loggedIn = () => {
  if (store.state.standard.token.token && store.state.standard.token.expiration > new Date().getTime()) {
    return true
  } else if (window.localStorage.getItem('token') && window.localStorage.getItem('expiration') > new Date().getTime()) {
    setToken(store, {token: window.localStorage.getItem('token'), expiration: window.localStorage.getItem('expiration')})
    return true
  } else {
    return false
  }
}

export const apiAddStandard = apiAdminBase + 'add_standard'

// appends the current token to the url string
export const withToken = (url) => url + '?token=' + token()
