import request from '@/utils/request'

// 省
export function getProvinces(query) {
  return request({
    url: '/system/dict/region/list/province',
    method: 'get',
    params: query,
  })
}

// 市
export function getCities(query) {
  return request({
    url: '/system/dict/region/list/city',
    method: 'get',
    params: query,
  })
}

// 区
export function getCounties(query) {
  return request({
    url: '/system/dict/region/list/county',
    method: 'get',
    params: query,
  })
}

// 街道
export function getStreet(query) {
  return request({
    url: '/system/dict/region/list/towns',
    method: 'get',
    params: query,
  })
}

// 市级
export function getCity(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query,
  })
}

// 区级
export function getCounty(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query,
  })
}
