import {apiLookupStandardRecord, apiGetStandardsFromMenu, Vue} from './config'

// Gets the specific Mongo standard document referenced by the filename
// standard -> String (filename of the standard)
export const getStandard = (standard) => {
  return Vue.http({url: apiLookupStandardRecord(standard), method: 'GET'})
}

// Gets the Mongo standard documents queried by the menu path
// menu -> Array (The list of menu items needed to find the standards)
export const getStandardsByMenu = (menu) => {
  return Vue.http({url: apiGetStandardsFromMenu, method: 'POST', data: {'menu': menu}})
}
