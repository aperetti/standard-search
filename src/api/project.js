import {apiProject} from './config'

export const getProjects = (standardId) => {
  if (standardId) {
    return apiProject.get(`/owned_projects/${standardId}`)
  } else {
    return apiProject.get('/owned_projects')
  }
}

export const deleteProject = (projectId) => apiProject.delete(`/delete_project/${projectId}`)

export const getProject = (projectId) => apiProject.get(`/by_id/${projectId}`)

export const toggleStandard = (projectId, standardId) => apiProject.post(`/toggle_standard/${projectId}/${standardId}`)

export const createProject = (name, description, standardIds) => {
  return apiProject.post(`/create_project/${name}`, {description: description, standards: standardIds})
}
