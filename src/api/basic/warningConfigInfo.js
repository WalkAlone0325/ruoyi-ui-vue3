import request from '@/utils/request'

// 查询告警配置信息列表
export function checkUniQue(query) {
  return request({
    url: '/op/warningConfigInfo/check/unique',
    method: 'get',
    params: query,
  })
}

// 查询告警配置列表
export function listWarningConfigInfo(query) {
  return request({
    url: '/op/warningConfigInfo/list/page',
    method: 'get',
    params: query,
  })
}

// 查询告警配置详细
export function getWarningConfigInfo(code) {
  return request({
    url: `/op/warningConfigInfo/${code}`,
    method: 'get',
  })
}

// 新增告警配置
export function addWarningConfigInfo(data) {
  return request({
    url: '/op/warningConfigInfo',
    method: 'post',
    data,
  })
}

// 修改告警配置
export function updateWarningConfigInfo(data) {
  return request({
    url: '/op/warningConfigInfo',
    method: 'put',
    data,
  })
}

// 删除告警配置
export function delWarningConfigInfo(code) {
  return request({
    url: `/op/warningConfigInfo/${code}`,
    method: 'delete',
  })
}
