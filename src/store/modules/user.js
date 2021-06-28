import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

// 为了方便更新，设置能成函数
const getDefaultState = () => {
  return {
    token: getToken(), // 先从cookie中获取token，如果没有就去登录
    name: '', // 获取用户信息后存储用户名字
    avatar: '' // 获取用户头像
  }
}

const state = getDefaultState()

const mutations = {
  // 重新设置信息
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },

  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置昵称
  SET_INFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // 返回值就是一个成功/失败的Promise
    return new Promise((resolve, reject) => {
      // 调用的是导进来的函数
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)  // 将token存储到cookie
          resolve() // 成功
        }).catch(error => {
          reject(error)
        })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter() // 重新设置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

