import {apiProjectsBase, Vue} from './config'

export const getProjects = (standardId) => {
  if (standardId) {
    return Vue.http({url: `${apiProjectsBase}owned_projects/${standardId}`, method: 'GET'})
  } else {
    return Vue.http({url: apiProjectsBase + 'owned_projects', method: 'GET'})
  }
}

export const deleteProject = (projectId) => {
  return Vue.http({url: `${apiProjectsBase}delete_project/${projectId}`, method: 'DELETE'})
}

export const getProject = (projectId) => {
  return Vue.http({url: `${apiProjectsBase}by_id/${projectId}`, method: 'GET'})
}

export const toggleStandard = (project, standard) => {
  return Vue.http({url: `${apiProjectsBase}toggle_standard/${project}/${standard}`, method: 'POST'})
}

export const createProject = (name, description, standardIds) => {
  return Vue.http({url: `${apiProjectsBase}create_project/${name}`, method: 'POST', data: {description: description, standards: standardIds}})
}
