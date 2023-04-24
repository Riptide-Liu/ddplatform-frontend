import request from "@/utils/request";
let base_url = '/admin/class'
// 查询班级列表
export function list(query) {
    return request({
        url: `${base_url}/list`,
        method: 'get',
        params: query
    })
}
export function listAll() {
    return request({
        url: `${base_url}/list/all`,
        method: 'get',
    })
}
// 查询班级详细
export function get(classId) {
    return request({
        url: `${base_url}/item`,
        method: 'get',
        params: {id: this.$helper.praseStrEmpty(classId)}
    })
}
// 新增班级
export function add(data) {
    return request({
        url: `${base_url}/add`,
        method: 'post',
        data: data
    })
}
// 编辑班级
export function edit(data) {
    return request({
        url: `${base_url}/edit`,
        method: 'post',
        data: data
    })
}
// 删除班级
export function del(ids) {
    return request({
        url: `${base_url}/delete`,
        method: 'post',
        data: ids
    })
}
