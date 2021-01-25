// ts封装 https://www.jianshu.com/p/297db1eff169?utm_campaign=hugo

import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import store from '@/store'
import router from '@/router'
import { ElMessage } from 'element-plus'
import qs from 'qs'

const request = axios.create({
  // 配置,
  // baseURL,
  // timeout
})

/* token过期问题 refresh_token 用于刷新替换过期的access_token 处理方法有以下两种
*
* 方法①：拦截请求数据，判断token有效时间是否已过期，若过期，则挂起请求(阻塞)，刷新tkenhou再继续请求
! 优点：节省请求次数，省流量
! 缺点：需要后端额外提供过期时间字段；使用了本地时间判断，本地时间可篡改，当本地时间比服务器时间慢时 拦截会失败
*
* 方法②：拦截响应数据，先发起请求，接口返回过期后，先刷新token，再重试发数据
! 优点：不需要额外的后端提供过期时间相关字段，不需要判断时间
! 缺点：可能会多消耗一次请求流量
*
* */

// 请求拦截器

request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // do something before request is seent
    // 改写config配置 实现功能统一处理 切记返回config 否则请求阻塞

    const {
      state: { user }
    } = store

    if (user?.access_token) {
      config.headers.Authorization = user.access_token
    }

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  })
}

function refreshToken() {
  // !不要使用request 否则递归死循环 使用axios实例 和request不是同一个
  return axios({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user?.refresh_token
    })
  })
}

let isRefreshed = false // 控制刷新 token 的状态 解决多次请求重复刷新问题
let requests: Array<() => void> = [] //!存储刷新token期间过来的401请求 防止漏掉请求
//let requests:(()=>void)[] = []

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 状态码2xx 响应进入此
    // any status code that lie within the range of 2xx cause this function to trigger
    // do something with response data

    return response
  },
  async error => {
    // 2xx范围之外的状态码 响应进入此
    // any status code that falls outside the range of 2xx cause this function to trigger
    // do something with response error

    if (error.response) {
      // 请求发出收到响应 但超过2xx范围

      const { status } = error.response

      switch (status) {
        case 400:
          ElMessage({
            message: '请求参数错误',
            type: 'error'
          })
          break
        case 401:
          // token无效 | 未提供token | token过期等
          // 如果有refresh_token 尝试用它来刷新 access_token
          // 成功 -> 重新发送请求
          // 失败 -> 跳转到登录页
          // 若没有refresh_token 直接跳转登录页
          if (!store.state.user) {
            redirectLogin()
            return Promise.reject(error)
          }

          // 刷新token
          if (!isRefreshed) {
            isRefreshed = true // 开始刷新状态

            // !无痛刷新 用户无感知 token过期也无伤大雅
            try {
              // !不要使用request 否则递归死循环 使用axios实例 和request不是同一个
              const {
                data: { success, content }
              } = await refreshToken()
              if (!success) {
                throw new Error('刷新token失败')
              }

              // 刷新token成功

              store.commit('setUser', content)
              const { data, method, url } = error.config

              // 把 requests 队列中的请求重新发出去
              requests.forEach(fn => fn())

              // 重置 requests数组
              requests = []

              return request({
                data,
                method,
                url
              })
            } catch (err) {
              store.commit('setUser', null)
              redirectLogin()
              return Promise.reject(error)
            } finally {
              isRefreshed = false // 重置刷新状态标记
            }
          }

          // 刷新状态 把请求挂起 放到 requests数组中
          // 没resolve 就一直在等待
          return new Promise(resolve => {
            requests.push(() => {
              resolve(request(error.config))
            })
          })

          /*ElMessage({
								message: 'token无效',
								type: 'error'
							})*/
          break
        case 403:
          ElMessage({
            message: '没有权限，请联系管理员',
            type: 'error'
          })
          break
        case 404:
          ElMessage({
            message: '请求资源不存在',
            type: 'error'
          })
          break
        default:
          // 500 501 等
          ElMessage({
            message: '服务器错误，请联系管理员',
            type: 'error'
          })
      }
    } else if (error.request) {
      // 请求发出但未收到响应
      ElMessage({
        message: '请求超时，请刷新重试',
        type: 'error'
      })
    } else {
      // 设置请求时触发了错误
      ElMessage({
        message: '请求失败：' + error.message,
        type: 'error'
      })
    }

    return Promise.reject(error)
  }
)

export default request
