import request from '@/utils/request'

export function getStatusValue(query) {
  return request({
    url: '/op/selenium/update/status/value',
    method: 'get',
    params: query,
  })
}

export function getUpdateLogin(query) {
  return request({
    url: '/op/selenium/update/login',
    method: 'get',
    params: query,
  })
}

export function getSeleniumInit(query) {
  return request({
    url: '/op/selenium/init',
    method: 'get',
    params: query,
  })
}

export function statusInfo(query) {
  return request({
    url: '/op/selenium/page/status',
    method: 'get',
    params: query,
  })
}
