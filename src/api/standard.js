import {apiLookupStandardById, apiLookupStandardByFile, apiGetStandardsFromMenu, apiValidStandard, apiSetNewStandard, apiGetStandardHtml, apiGetStandardPdf, Vue} from './config'

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const getStandardById = (id) => {
  return Vue.http({url: apiLookupStandardById(id), method: 'GET'})
}

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const getStandardByFile = (fileName) => {
  return Vue.http({url: apiLookupStandardByFile(fileName), method: 'GET'})
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
  return Vue.http({url: apiGetStandardPdf})
}
