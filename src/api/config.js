import store from 'src/vuex/store'
import axios from 'axios'

function extendWithToken (axios, base) {
  var extend = axios.create({baseURL: base})
  extend.interceptors.request.use(function (config) {
    config.headers.authorization = 'Bearer ' + token()
    return config
  })
  extend.interceptors.response.use(function (response) {
    if (Object.keys(response.headers).indexOf('auth-token') !== -1) {
      console.log(response.headers)
      setLocal('token', response.headers['auth-token'])
      setLocal('expiration', response.headers['auth-expiration'])
      hydrateUser()
    }
    return response
  })
  return extend
}

export {axios}

export const domainBase = 'https://www.photoredux.com/'

export const apiBase = domainBase + 'api/'
export const apiAuth = apiBase + 'authenticate'

export const apiProject = extendWithToken(axios, apiBase + 'user/projects/')
export const apiStandard = extendWithToken(axios, apiBase + 'standards/')
export const apiAdmin = extendWithToken(axios, apiBase + 'admin/')
export const apiUser = extendWithToken(axios, apiBase + 'user/')
export const apiGetStandardPdf = (standard) => {
  return apiBase + 'standards/pdf/' + standard
}

export const apiAddStandard = apiBase + 'admin/add_standard'
export const apiEditStandard = apiBase + 'admin/edit_standard'
// Used to determine if the current User is admin. Should only be used to affect display. All authentication
// should take place on the server.

export const loggedIn = () => {
  if (store.state.user.token.token && store.state.user.token.expiration > new Date().getTime()) {
    return true
  } else if (window.localStorage.getItem('token') && window.localStorage.getItem('expiration') > new Date().getTime()) {
    hydrateUser()
    return true
  } else {
    return false
  }
}

export function token () {
  return store.state.user.token.token || getLocal('token')
}

function getLocal (str) { return window.localStorage.getItem(str) }

function setLocal (str, val) { return window.localStorage.setItem(str, val) }
function hydrateUser () {
  store.dispatch(
    'hydrateUser',
    {name: getLocal('username'), roles: JSON.parse(getLocal('roles')), token: {token: getLocal('token'), expiration: window.localStorage.getItem('expiration')}}
  )
}
// appends the current token to the url string
export const withToken = (url) => url + '?token=' + token()
