import {apiAddHistory, elasticSearch, apiGetHistory, apiLookupStandardById, apiGetStandardsFromMenu, apiValidStandard, apiSetNewStandard, apiGetStandardHtml, apiGetStandardPdf, apiStandardRevisions, Vue} from './config'

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const getStandardById = (id) => {
  return Vue.http({url: apiLookupStandardById(id), method: 'GET'})
}

// Get Revisions
export const getStandardRevisions = (id) => {
  return Vue.http({url: apiStandardRevisions(id), method: 'GET'})
}

// Gets the Mongo standard documents queried by the menu path
// menu -> Array (The list of menu items needed to find the standards)
export const getStandardsByMenu = (menu) => {
  return Vue.http({url: apiGetStandardsFromMenu, method: 'POST', data: {'menu': menu}})
}

// Sends Standard Object for Server to Create Record
export const setNewStandard = (standard) => {
  return Vue.http({url: apiSetNewStandard, method: 'POST', data: {standard: standard}})
}

// Requires Admin
export const validStandard = (code) => {
  return Vue.http({url: apiValidStandard + code, method: 'GET'})
}

export const getHtmlStandard = (code) => {
  return Vue.http({url: apiGetStandardHtml(code), method: 'GET'})
}

export const getPdfStandard = (code) => {
  return Vue.http({url: apiGetStandardPdf(code), method: 'GET'})
}

// Takes the current standardId and adds it to the user's history
export const addHistory = (standardId) => {
  return Vue.http({url: apiAddHistory + standardId, method: 'POST'})
}

export const getHistory = () => {
  return Vue.http({url: apiGetHistory})
}

export const searchStandard = (search, fields = ['code', 'desc'], fuzzy = 2) => {
  var data = {}
  data.fields = (fields && fields.length > 0) ? fields : undefined
  data.search = search
  data.fuzzy = (fuzzy && typeof fuzzy === 'number') ? fuzzy : 0
  return Vue.http({url: elasticSearch, method: 'POST', data: data})
}
