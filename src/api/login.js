import request from '@/utils/request'

// 登录方法
export function login(username, password) {
    const data = {
        username,
        password
    }
    return request({
        url: '/user/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

export function getInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
    const data = {
        userId,
        password
    }
    return request({
        url: '/system/user/resetPwd',
        method: 'put',
        data: data
    })
}
