import request from "@/utils/request";
let base_url = '/admin/class/course'
// 查询课程计划列表
export function list(query) {
    return request({
        url: `${base_url}/list`,
        method: 'get',
        params: query
    })
}
// 查询课程计划详细
export function get(classId) {
    return request({
        url: `${base_url}/item`,
        method: 'get',
        params: {id: this.$helper.praseStrEmpty(classId)}
    })
}
// 新增课程计划
export function add(data) {
    return request({
        url: `${base_url}/add`,
        method: 'post',
        data: data
    })
}
// 编辑课程计划
export function edit(data) {
    return request({
        url: `${base_url}/edit`,
        method: 'post',
        data: data
    })
}
// 删除课程计划
export function del(ids) {
    return request({
        url: `${base_url}/delete`,
        method: 'post',
        data: ids
    })
}
