import request from '@/utils/request'

// 未绑定站点信息列表
export function listStationNotBind(query) {
  return request({
    url: '/system/personnelBasicInfo/list/notdept/page',
    method: 'get',
    params: query,
  })
}

// 已绑定站点信息列表
export function listStationYesBind(query) {
  return request({
    url: '/system/personnelBasicInfo/list/page',
    method: 'get',
    params: query,
  })
}

// 新增站点信息
export function addBind(data) {
  return request({
    url: '/system/personnelBasicInfo/personnel/dept/rel',
    method: 'post',
    data,
  })
}

// 修改站点信息
export function updateBind(data) {
  return request({
    url: '/system/stationInfo',
    method: 'put',
    data,
  })
}

// 删除站点信息
export function delBind(data) {
  return request({
    url: '/system/personnelBasicInfo/unbundle/personnel/dept/rel',
    method: 'post',
    data,
  })
}
