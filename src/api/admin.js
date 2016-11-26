import {apiAdminBase, Vue} from 'src/api/config'

// Expects an array with objects of followign schema {}
var apiSaveCategories = apiAdminBase + 'save_categories'
export const saveCategories = (refs) => {
  return Vue.http({url: apiSaveCategories, method: 'POST', data: {types: refs}})
}

var apiGetCategories = apiAdminBase + 'categories'
export const getCategories = () => {
  return Vue.http({url: apiGetCategories, methods: 'GET'})
}

export const apiProcessPdf = apiAdminBase + 'process_pdf'
