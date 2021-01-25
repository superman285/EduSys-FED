/**
 *  资源相关请求模块
 */

import request from '@/utils/request'
import { AxiosPromise } from 'axios'


type Resource = {
  id: number | null,
  name: string,
  url: string,
  categoryId: number | null,
  description: string
}

export const getResourcePages = (data: {
  current: number
  size: number
  name?: string
  url?: string
  categoryId?: number | string
}) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const getAllResources = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

export const allocRoleResources = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

export const getResourceById = (id:number)=>{
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

export const createOrUpdate = (data: Resource) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

export const getRoleResources = (roleId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}

type ResourceCategoryRes = {
  code: string,
  mesg: string,
  time: string,
  data: Array<ResourceCategoryTop>
}

export type BaseResourceCategory = {
  name:        string;
  id:          number;
  sort?:        number;
  createdBy:   string;
  selected:    boolean;
  updatedBy:   string;
  createdTime: string;
  updatedTime: string;
  operatorId:  number | null;
}

type ResourceSubCategory = BaseResourceCategory & {categoryId:number,url:string,description:string}

export type ResourceCategoryTop = BaseResourceCategory & {
  children: Array<ResourceSubCategory>
}

export const getResourceCategories = ():AxiosPromise<ResourceCategoryRes> => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

export const deleteResource = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}
