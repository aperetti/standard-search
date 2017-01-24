import {apiAdmin} from 'src/api/config'

// Expects an array with objects of followign schema {}
export const saveCategories = (refs) => apiAdmin.post('/save_categories', {types: refs})

export const getCategories = () => apiAdmin.get('/categories')

export const processPdf = (formData) => apiAdmin.post('/process_pdf', formData)

export const saveSetting = (id, val) => apiAdmin.post('/save_setting', {setting: val}, {params: {id: id}})

export const addStandard = (formData) => apiAdmin.post('/add_standard', formData)

export const editStandard = (formData) => apiAdmin.post('/edit_standard', formData)

export const keywords = (id) => apiAdmin.get('/keywords', {params: {id: id}})

export const saveKeywords = (data) => apiAdmin.post('/save_keywords', data)
