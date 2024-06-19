import request from '@/utils/request'

// 查询告警配置列表
export function listWarningConfigDetail(query) {
  return request({
    url: '/op/warningConfigDetail/list/page',
    method: 'get',
    params: query,
  })
}

// 查询告警配置详细
export function getWarningConfigDetail(id) {
  return request({
    url: `/op/warningConfigDetail/${id}`,
    method: 'get',
  })
}

// 新增告警配置
export function addWarningConfigDetail(data) {
  return request({
    url: '/op/warningConfigDetail',
    method: 'post',
    data,
  })
}

// 修改告警配置
export function updateWarningConfigDetail(data) {
  return request({
    url: '/op/warningConfigDetail',
    method: 'put',
    data,
  })
}

// 删除告警配置
export function delWarningConfigDetail(id) {
  return request({
    url: `/op/warningConfigDetail/${id}`,
    method: 'delete',
  })
}

// 告警配置类型
export function optionsWarningType() {
  return request({
    url: '/op/warningConfigInfo/list',
    method: 'get',
  })
}

// 消息模板编码
export function optionsVoiceType() {
  return request({
    url: '/op/voiceTemplateInfo/list',
    method: 'get',
  })
}

// 生效岗位
export function optionsEffectType() {
  return request({
    url: '/system/post/list/all',
    method: 'get',
  })
}
