import request from '@/utils/request'

// 查询网络爬虫配置信息列表
export function chekUniQue(query) {
  return request({
    url: '/op/webCrawlerConfigInfo/check/unique',
    method: 'get',
    params: query,
  })
}

// 查询网络爬虫配置信息列表
export function listWebCrawlerConfigInfo(query) {
  return request({
    url: '/op/webCrawlerConfigInfo/list',
    method: 'get',
    params: query,
  })
}

// 查询网络爬虫配置信息详细
export function getWebCrawlerConfigInfo(code) {
  return request({
    url: `/op/webCrawlerConfigInfo/${code}`,
    method: 'get',
  })
}

// 新增网络爬虫配置信息
export function addWebCrawlerConfigInfo(data) {
  return request({
    url: '/op/webCrawlerConfigInfo',
    method: 'post',
    data,
  })
}

// 修改网络爬虫配置信息
export function updateWebCrawlerConfigInfo(data) {
  return request({
    url: '/op/webCrawlerConfigInfo',
    method: 'put',
    data,
  })
}

// 删除网络爬虫配置信息
export function delWebCrawlerConfigInfo(code) {
  return request({
    url: `/op/webCrawlerConfigInfo/${code}`,
    method: 'delete',
  })
}
