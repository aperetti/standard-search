import {apiStandard, apiUser} from './config'

// Retrieves information about the standard.
export const getStandardInfo = (id) => apiStandard.get(`/lookup/${id}`)

// Get Revisions
export const getStandardRevisions = (id) => apiStandard.get(`/revisions/${id}`)

// Requires Admin
export const validStandard = (code) => apiStandard.get(`/valid_standard/${code}`)

// Gets the File
export const getPdfStandard = (id) => apiStandard.get(`/pdf/${id}`)

// View Redirects to a temporary link to access the PDF
export const viewPdfStandard = (id) => apiStandard.get(`/nonce/${id}`)

// Takes the current standardId and adds it to the user's history
export const addHistory = (id) => apiUser.post(`/add_history/${id}`)

export const getHistory = () => apiUser.get('/get_history')

export const searchStandard = (search, fields = ['code^10'], fuzzy = 0) => {
  var data = {}
  data.fields = fields
  data.search = search
  data.fuzzy = fuzzy
  return apiStandard.post('/search', data)
}

// Performs a substring search starting with the whole word and then removing the last letter and trying again until only 1 letter is searched.
export const searchSubstring = (substring) => apiStandard.post('/search/substring', {substring: substring})
// Performs a simple like query on the standards code
export const findStandard = (id) => apiStandard.get(`/find_standard/${id}`)

export const getSetting = (id) => apiStandard.get(`/get_setting/${id}`)
