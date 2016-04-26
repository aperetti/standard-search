import {apiMenuUrl} from './config'

export const getMenu = () => {
  this.$http({url: apiMenuUrl, method: 'GET', params: {token: window.localStorage.getItem('token')}}).then((response) => {
    console.log(response.data)
    return response.data
  }, (response) => {
    return []
  })
}
