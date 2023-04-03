import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/utils/auth'
import { login, getInfo, logout } from '@/api/login'
import getters from "@/store/getters";
import * as text from "@/res/text";
import * as constant from "@/res/constant";

Vue.use(Vuex)

/** 状态定义 */
const module = {
    state: {
        loading: false,
        token: '',
        user_info: {},
        roles: [],
        permissions: [],
        text: text,
        constant: constant,
    },
    mutations: {
        SET_USER_INFO: (state, user_info) => {
            state.user_info = user_info
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
    },
    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username
            const password = userInfo.password
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    auth.setToken(res.data.token)
                    commit('SET_TOKEN', res.data.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        getInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.data.user
                    commit('SET_USER_INFO', user)
                    commit('SET_TOKEN', auth.getToken())
                    // const avatar = user.avatar === '' ? require('@/assets/images/profile.jpg') : process.env.VUE_APP_BASE_API + user.avatar
                    if (res.data.permissions && res.data.permissions.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', res.data.permissions)
                    } else {
                        commit('SET_ROLES', ['ROLE_DEFAULT'])
                    }
                    // commit('SET_AVATAR', avatar)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    auth.removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登录状态失效时
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                auth.removeToken()
                resolve()
            })
        }
    }
}

export default new Vuex.Store({
    ...module,
     getters
})
