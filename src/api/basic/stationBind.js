import request from '@/utils/request'

// 查询部门下拉树结构
export function deptTreeSelectNotStation() {
  return request({
    url: '/system/user/deptTree/notStation',
    method: 'get',
  })
}

// 未绑定站点信息列表
export function listStationNotBind(query) {
  return request({
    url: '/op/stationInfo/list/unbound/dept',
    method: 'get',
    params: query,
  })
}

// 已绑定站点信息列表
export function listStationYesBind(query) {
  return request({
    url: '/op/stationInfo/list/binding/dept',
    method: 'get',
    params: query,
  })
}

// 新增站点信息
export function addBind(data) {
  return request({
    url: '/op/stationInfo/binding/dept',
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
    url: '/op/stationInfo/unbound/dept',
    method: 'post',
    data,
  })
}
