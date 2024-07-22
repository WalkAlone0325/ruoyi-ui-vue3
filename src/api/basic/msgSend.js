import request from '@/utils/request'

// 日志
export function listMsgLog(query) {
  return request({
    url: '/op/messageNotificationLog/list/page',
    method: 'get',
    params: query,
  })
}

// 查询通知公告详细
export function getMessageNotificationLog(id) {
  return request({
    url: `/op/messageNotificationLog/${id}`,
    method: 'get',
  })
}

// 删除日志
export function delMsgLog(stationCode) {
  return request({
    url: `/op/messageNotificationLog/${stationCode}`,
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
