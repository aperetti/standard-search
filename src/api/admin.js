import {apiAdminBase, Vue} from 'src/api/config'

var apiSaveCategories = apiAdminBase + 'save_categories'
// Expects an array with objects of followign schema {}
export const saveCategories = (refs) => {
  return Vue.http({url: apiSaveCategories, method: 'POST', data: {references: refs}})
}

var apiGetCategories = apiAdminBase + 'categories'
export const getCategories = () => {
  return Vue.http({url: apiGetCategories, methods: 'GET'})
}
