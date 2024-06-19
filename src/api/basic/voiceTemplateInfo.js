import request from '@/utils/request'

// 检测 code
export function chekUniQue(query) {
  return request({
    url: '/op/voiceTemplateInfo/check/unique',
    method: 'get',
    params: query,
  })
}

// 查询语音模板配置列表
export function listVoiceTemplateInfo(query) {
  return request({
    url: '/op/voiceTemplateInfo/list/page',
    method: 'get',
    params: query,
  })
}

// 查询语音模板配置详细
export function getVoiceTemplateInfo(code) {
  return request({
    url: `/op/voiceTemplateInfo/${code}`,
    method: 'get',
  })
}

// 新增语音模板配置
export function addVoiceTemplateInfo(data) {
  return request({
    url: '/op/voiceTemplateInfo',
    method: 'post',
    data,
  })
}

// 修改语音模板配置
export function updateVoiceTemplateInfo(data) {
  return request({
    url: '/op/voiceTemplateInfo',
    method: 'put',
    data,
  })
}

// 删除语音模板配置
export function delVoiceTemplateInfo(code) {
  return request({
    url: `/op/voiceTemplateInfo/${code}`,
    method: 'delete',
  })
}
