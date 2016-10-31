import {apiAddReferences, apiGetReferences, Vue} from 'src/api/config'

// Expects an array with objects of followign schema {group: 'Regex Group Example', regex: '(reg|regex)', modifiers: 'g'}
export const addReference = (refs) => {
  return Vue.http({url: apiAddReferences, method: 'POST', data: {references: refs}})
}

export const getReference = () => {
  return Vue.http({url: apiGetReferences, methods: 'GET'})
}
