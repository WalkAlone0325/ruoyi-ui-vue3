import request from '@/utils/request'

// 查询塔机配置
export function getTowerConfig() {
  return request({
    url: '/china/tower/config',
    method: 'get',
  })
}

// 编辑塔机配置
export function postTowerConfig(data) {
  return request({
    url: '/china/tower/config',
    method: 'post',
    data,
  })
}
