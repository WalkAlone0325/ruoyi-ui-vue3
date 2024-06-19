import request from '@/utils/request'

// 查询人才基础信息列表
export function listPersonnelBasicInfo(query) {
  return request({
    url: '/system/personnelBasicInfo/list/page',
    method: 'get',
    params: query,
  })
}

// 查询人才基础信息详细
export function getPersonnelBasicInfo(personnelId) {
  return request({
    url: `/system/personnelBasicInfo/${personnelId}`,
    method: 'get',
  })
}

// 新增人才基础信息
export function addPersonnelBasicInfo(data) {
  return request({
    url: '/system/personnelBasicInfo',
    method: 'post',
    data,
  })
}

// 修改人才基础信息
export function updatePersonnelBasicInfo(data) {
  return request({
    url: '/system/personnelBasicInfo',
    method: 'put',
    data,
  })
}

// 删除人才基础信息
export function delPersonnelBasicInfo(personnelId) {
  return request({
    url: `/system/personnelBasicInfo/${personnelId}`,
    method: 'delete',
  })
}
