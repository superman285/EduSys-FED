/**
 *  用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'
import { AxiosPromise } from 'axios'
// import store, { LoginUser, key } from '@/store'

interface User {
  phone: string
  password: string
}

export interface UserInfo {
  isUpdatedPassword: boolean
  portrait: string
  userName: string
  weixinNickName: string
}

export const login = (formData: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(formData)
    // axios默认发送的是application/json格式数据 | qs stringify处理后为application/x-www-urlencoded格式数据
  })
}

// 获取当前登录用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
      // Authorization: (store.state.user as LoginUser).access_token
    }
  })
}

type UserPagesRes = {
  code: string
  mesg: string
  time: Date
  data: UserPagesData
}

type AnyKV = Record<string, any>

type UserPagesData = {
  records: UserRecord[]
  total: number
  size: number
  current: number
  orders: any[]
  optimizeCountSql: boolean
  hitCount: boolean
  searchCount: boolean
  pages: number
} & AnyKV

type UserPagesDataReq = Partial<UserPagesData>

export type UserRecord = {
  id: number
  name: string
  portrait: null | string
  phone: string
  password: string
  regIp: null | string
  accountNonExpired: boolean
  credentialsNonExpired: boolean
  accountNonLocked: boolean
  status: 'DISABLE' | 'ENABLE'
  isDel: boolean
  createTime: string
  updateTime: string
}

export const getUserPages = (
  data: UserPagesDataReq
): AxiosPromise<UserPagesRes> => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
