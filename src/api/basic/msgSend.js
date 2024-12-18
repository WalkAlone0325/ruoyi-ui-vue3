import request from '@/utils/request'

// 查询通知公告列表
export function listMsgLog(query) {
  return request({
    url: '/op/messageNotificationCombineLog/list/page',
    method: 'get',
    params: query,
  })
}

// 查询通知公告详细
export function getMessageNotificationLog(id) {
  return request({
    url: `/op/messageNotificationCombineLog/${id}`,
    method: 'get',
  })
}

// 新增通知公告
export function addMessageNotificationCombineLog(data) {
  return request({
    url: '/op/messageNotificationCombineLog',
    method: 'post',
    data,
  })
}

// 修改通知公告
export function updateMessageNotificationCombineLog(data) {
  return request({
    url: '/op/messageNotificationCombineLog',
    method: 'put',
    data,
  })
}

// 删除通知公告
export function delMsgLog(id) {
  return request({
    url: `/op/messageNotificationCombineLog/${id}`,
    method: 'delete',
  })
}

// 错误日志
export function listMsgErrorLog(query) {
  return request({
    url: '/op/messageNotificationWarningLog/list/page',
    method: 'get',
    params: query,
  })
}

// 查询通知公告详细
export function getMessageNotificationWarningLog(id) {
  return request({
    url: `/op/messageNotificationWarningLog/${id}`,
    method: 'get',
  })
}

// 删除错误日志
export function delMsgErrorLog(stationCode) {
  return request({
    url: `/op/messageNotificationWarningLog/${stationCode}`,
    method: 'delete',
  })
}
