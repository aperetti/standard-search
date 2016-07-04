import {apiProjectsBase, Vue} from './config'

export const getProjects = () => {
  return Vue.http({url: apiProjectsBase + 'owned_projects', method: 'GET'})
}

export const toggleStandard = (project, standard) => {
  return Vue.http({url: `${apiProjectsBase}toggle_standard/${project}/${standard}`, method: 'POST'})
}

export const createProject = (name, description, standard) => {
  return Vue.http({url: `${apiProjectsBase}create_project/${name}`, method: 'POST', data: {description: description, standards: [standard]}})
}
