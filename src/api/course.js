import request from "@/utils/request";
let base_url = '/course'
// 查询课程列表
export function list(query) {
    return request({
        url: `${base_url}/list`,
        method: 'get',
        params: query
    })
}

// 查询课程详细
export function get(classId) {
    return request({
        url: `${base_url}/item`,
        method: 'get',
        params: {id: classId}
    })
}

// 查询课程资源
export function getResources(classId) {
    return request({
        url: `${base_url}/resource/list`,
        method: 'get',
        params: {course_id: classId}
    })
}

// 查询同班同学
export function getStudent() {
    return request({
        url: `class/student/list`,
        method: 'get',
    })
}
