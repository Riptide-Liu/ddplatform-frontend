import request from "@/utils/request";
// 查询用户列表
export function listUser(query) {
    return request({
        url: '/admin/user/list',
        method: 'get',
        params: query
    })
}
// 查询用户详细
export function getUser(userId) {
    return request({
        url: '/admin/user/item',
        method: 'get',
        params: {id: this.$helper.praseStrEmpty(userId)}
    })
}
// 新增用户
export function addUser(data) {
    return request({
        url: '/admin/user/add',
        method: 'post',
        data: data
    })
}
// 编辑用户
export function editUser(data) {
    return request({
        url: '/admin/user/edit',
        method: 'post',
        data: data
    })
}
// 删除用户
export function delUser(ids) {
    return request({
        url: '/admin/user/delete',
        method: 'post',
        data: ids
    })
}
