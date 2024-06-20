import request from '@/utils/request'

// 查询预警订单列表
export function listWarningOrder(query) {
  return request({
    url: '/op/warningFaultOrderAlarmInfo/list/page',
    method: 'get',
    params: query,
  })
}

// 查询预警订单详情列表
export function listDetailWarningOrder(query) {
  return request({
    url: '/op/warningFaultOrderAlarmDetail/list/page',
    method: 'get',
    params: query,
  })
}

// 告警配置类型
export function listWarningType() {
  return request({
    url: '/op/warningConfigInfo/list',
    method: 'get',
  })
}

// 告警配置
export function listWarningConfig(query) {
  return request({
    url: '/op/warningConfigDetail/list',
    method: 'get',
    params: query,
  })
}
