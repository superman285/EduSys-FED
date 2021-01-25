/**
 *  菜单相关请求模块
 */

import request from '@/utils/request'


export interface IMenu {
  createdBy?: string
  createdTime?: string
  description: string
  href: string
  icon: string
  id: number
  level?: number
  name: string
  operatorId?: null
  orderNum: number
  parentId: number
  shown: boolean
  updatedBy?: string
  updatedTime?: string
}

interface IRoleSubMenu extends IMenu {
  selected: boolean
  subMenuList: null
}

export interface IRoleMenu extends IMenu {
  selected: boolean
  // subMenuList: IRoleSubMenu | null
  subMenuList: Array<IRoleMenu> | null
}

export const createOrUpdateMenu = (data: IMenu) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

type AllocRoleData = {
  roleId: string | number
  menuIdList: []
}

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
