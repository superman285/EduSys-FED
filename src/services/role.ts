/**
 * 角色相关请求模块
 */

import request from '@/utils/request'

type QueryFilter = {
  current: number,
  size: number,
  name: string
}

type CreateFilter = {
  code: string,
  name: string,
  description: string
}

export const getRoles = (data: QueryFilter) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

export const deleteRole = (id: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

export const createOrUpdate = (data: CreateFilter) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

export const getRoleById = (id: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

export const allocateUserRoles = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

export const getUserRoles = (userId: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
