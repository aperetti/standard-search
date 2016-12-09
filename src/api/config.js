import store from 'src/vuex/store'
import axios from 'axios'

axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`

export {axios}

export const domainBase = 'https://www.photoredux.com/'

export const apiBase = domainBase + 'api/'
export const apiAuth = apiBase + 'authenticate'

export const apiProject = axios.create({baseURL: apiBase + 'user/projects/'})
export const apiStandard = axios.create({baseURL: apiBase + 'standards/'})
export const apiAdmin = axios.create({baseURL: apiBase + 'admin/'})
export const apiUser = axios.create({baseURL: apiBase + 'user/'})
export const apiGetStandardPdf = (standard) => {
  return apiBase + '/standards/pdf/' + standard
}

// Used to determine if the current User is admin. Should only be used to affect display. All authentication
// should take place on the server.

export const token = () => {
  return store.state.user.token.token
}

export const loggedIn = () => {
  if (store.state.user.token.token && store.state.user.token.expiration > new Date().getTime()) {
    return true
  } else if (window.localStorage.getItem('token') && window.localStorage.getItem('expiration') > new Date().getTime()) {
    store.dispatch(
      'hydrateUser',
      {name: getLocal('username'), roles: JSON.parse(getLocal('roles')), token: {token: getLocal('token'), expiration: window.localStorage.getItem('expiration')}}
    )
    return true
  } else {
    return false
  }
}

const getLocal = (str) => window.localStorage.getItem(str)

// appends the current token to the url string
export const withToken = (url) => url + '?token=' + token()
