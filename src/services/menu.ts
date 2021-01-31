/**
 *  菜单相关请求模块
 */
import request from '@/utils/request'

//@ts-ignore
export interface IMenu {
  createdBy?: string
  createdTime?: string
  description: string
  href: string
  icon: string
  id: number
  level?: number
  name: string
  operatorId?: any
  orderNum: number
  parentId: number
  shown: boolean
  updatedBy?: string
  updatedTime?: string
}
//@ts-ignore
interface IRoleSubMenu extends IMenu {
  selected: boolean
  subMenuList: any
}
//@ts-ignore
export interface IRoleMenu extends IMenu {
  selected: boolean
  // subMenuList: IRoleSubMenu | null
  subMenuList: Array<IRoleMenu> | null
}
//@ts-ignore
export const createOrUpdateMenu = (data: IMenu) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}
//@ts-ignore
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}
//@ts-ignore
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}
//@ts-ignore
export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
//@ts-ignore
export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}
//@ts-ignore
type AllocRoleData = {
  roleId: string | number
  menuIdList: []
}
//@ts-ignore
export const allocRoleMenus = (data: AllocRoleData) => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}

export const getRoleMenus = (roleId:string|number)=> {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}
