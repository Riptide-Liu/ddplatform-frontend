import request from "@/utils/request";
let base_url = '/admin/course/resource'
// 查询课程资源列表
export function list(query) {
    return request({
        url: `${base_url}/list`,
        method: 'get',
        params: query
    })
}
// 查询课程资源详细
export function get(classId) {
    return request({
        url: `${base_url}/item`,
        method: 'get',
        params: {id: this.$helper.praseStrEmpty(classId)}
    })
}
// 新增课程资源
export function add(data) {
    return request({
        url: `${base_url}/add`,
        method: 'post',
        data: data
    })
}
// 编辑课程资源
export function edit(data) {
    return request({
        url: `${base_url}/edit`,
        method: 'post',
        data: data
    })
}
// 删除课程资源
export function del(ids) {
    return request({
        url: `${base_url}/delete`,
        method: 'post',
        data: ids
    })
}
