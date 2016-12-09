import {apiAdmin} from 'src/api/config'

// Expects an array with objects of followign schema {}
export const saveCategories = (refs) => {
  return apiAdmin.post('/save_categories', {types: refs})
}

export const getCategories = () => {
  return apiAdmin.get('/categories')
}

export const processPdf = (formData) => {
  return apiAdmin.post('/process_pdf', formData)
}

export const saveSetting = (id, val) => {
  return apiAdmin.post('/save_setting', {setting: val}, {params: {id: id}})
}
