import {apiAdmin, apiStandard} from './config'

export const getMenu = (id) => apiStandard.get(`/menu/${id}`)
export const createMenu = (menu) => apiAdmin.post('/create_menu', menu)
export const deleteMenu = (id) => apiAdmin.delete(`/delete_menu/${id}`)

