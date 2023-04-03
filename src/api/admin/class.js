import request from "@/utils/request";
// 查询班级列表
export function list(query) {
    return request({
        url: '/admin/class/list',
        method: 'get',
        params: query
    })
}
// 查询班级详细
export function get(classId) {
    return request({
        url: '/admin/class/item',
        method: 'get',
        params: {id: this.$helper.praseStrEmpty(classId)}
    })
}
// 新增班级
export function add(data) {
    return request({
        url: '/admin/class/add',
        method: 'post',
        data: data
    })
}
// 编辑班级
export function edit(data) {
    return request({
        url: '/admin/class/edit',
        method: 'post',
        data: data
    })
}
// 删除班级
export function del(ids) {
    return request({
        url: '/admin/class/delete',
        method: 'post',
        data: ids
    })
}
