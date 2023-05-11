// 获取文件下载地址

import request from "@/utils/request";

export function getFileUrl(file_name) {
    let domin = "http://rtt4fgqt3.bkt.clouddn.com"
    return `${domin}/${file_name}`
}
export function download(file_name) {
  return request({
    url: `file/download`,
    method: 'get',
    params: {fileName: file_name}
  })
}