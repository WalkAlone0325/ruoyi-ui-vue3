import request from '@/utils/request'

// 查询塔机配置
export function getVerify() {
  return request({
    url: '/china/tower/verification',
    method: 'get',
  })
}

// 编辑塔机配置
export function postVerify(data) {
  return request({
    url: '/china/tower/verification',
    method: 'post',
    data,
  })
}

// 判断是否满足登录条件
export function checkLoginCondition(data) {
  return request({
    url: '/op/selenium/login/password/conditions',
    method: 'get',
    data,
  })
}

// 判断是否满足登录条件session
export function checkLoginConditionSession(data) {
  return request({
    url: '/op/selenium/login/password/conditions/session',
    method: 'get',
    data,
  })
}

// 判断是否满足登录条件session
export function checkLogin(data) {
  return request({
    url: '/op/selenium/login/password/login',
    method: 'get',
    data,
  })
}

// 判断是否满足登录条件session
export function checkRefresh(data) {
  return request({
    url: '/op/selenium/login/password/refresh/msg',
    method: 'get',
    data,
  })
}

// 判断是否满足登录条件session
export function checkCode(data) {
  return request({
    url: '/op/selenium/login/password/send/checkcode',
    method: 'get',
    data,
  })
}

// 判断是否满足登录条件session
export function checkVerification(data) {
  return request({
    url: `/op/selenium/login/password/send/checkcode/${data}`,
    method: 'get',
  })
}
