import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export interface LoginUser {
  access_token: string
  expires_in: number
  jti: string
  organization: string
  refresh_token: string
  scope: string
  token_type: string
  user_id: string
}

export interface IState {
  user: LoginUser | null
}

// export const key: InjectionKey<Store<IState>> = Symbol()

export default createStore<IState>({
  state: {
    user: null // 当期登录用户状态
  },
  mutations: {
    // 修改容器数据
    setUser(state, payload) {
      state.user = JSON.parse(payload)
    }
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()]
})
