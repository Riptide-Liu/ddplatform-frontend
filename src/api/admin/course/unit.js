import request from "@/utils/request";
let base_url = '/admin/chapter/unit'
// 查询章节单元列表
export function list(query) {
    return request({
        url: `${base_url}/list`,
        method: 'get',
        params: query
    })
}
// 查询章节单元详细
export function get(id) {
    return request({
        url: `${base_url}/item`,
        method: 'get',
        params: {id}
    })
}
// 新增章节单元
export function add(data) {
    return request({
        url: `${base_url}/add`,
        method: 'post',
        data: data
    })
}
// 编辑章节单元
export function edit(data) {
    return request({
        url: `${base_url}/edit`,
        method: 'post',
        data: data
    })
}
// 删除章节单元
export function del(ids) {
    return request({
        url: `${base_url}/delete`,
        method: 'post',
        data: ids
    })
}
