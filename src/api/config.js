import store from '../vuex/store'
import Vue from 'vue'
import VueResource from 'vue-resource'
import {setToken} from '../vuex/actions'

Vue.use(VueResource)

// The following intercepts any request and updates the Authorization token
Vue.http.interceptors.push({
  request: (request) => {
    if (window.localStorage.getItem('token')) {
      request.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token')
    }
    return request
  }
})

export {Vue}

export const domainBase = 'https://photoredux.com/'
export const apiBase = domainBase + 'api/'
export const apiAuth = apiBase + 'authenticate'
export const apiStandardsBase = apiBase + 'standards/'
export const elasticSearch = apiStandardsBase + 'search'
export const apiAdminBase = apiBase + 'admin/'
export const apiGetMenus = apiStandardsBase + 'menu'
export const apiUserBase = apiBase + 'user/'
export const apiAddHistory = apiUserBase + 'add_history/'
export const apiGetHistory = apiUserBase + 'get_history/'
export const apiProjectsBase = apiBase + 'user/projects/'

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const apiLookupStandardById = (standard) => {
  return apiStandardsBase + 'lookup/' + standard
}

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const apiLookupStandardByFile = (standard) => {
  return apiStandardsBase + 'lookup_file/' + standard
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
export const apiEditStandard = apiAdminBase + 'edit_standard'

export const apiGetReferences = apiAdminBase + 'get_references'
export const apiAddReferences = apiAdminBase + 'add_references'

// appends the current token to the url string
export const withToken = (url) => url + '?token=' + token()
