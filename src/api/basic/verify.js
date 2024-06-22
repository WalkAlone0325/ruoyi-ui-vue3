import request from '@/utils/request'

// 查询塔机配置
export function getVerify() {
  return request({
    url: '/china/tower/verification',
    method: 'get',
  })
}

// 编辑塔机配置
export function postVerify(data) {
  return request({
    url: '/china/tower/verification',
    method: 'post',
    data,
  })
}
