/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 登录接口
export function getDemo (params) {
  return service({
    url: `/static/resource/demo/get.json`,
    type: 'GET',
    params
  })
}
// post接口
export function postDemo (data) {
  return service({
    url: `/static/resource/demo/post.json`,
    type: 'POST',
    data
  })
}
