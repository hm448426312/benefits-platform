/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取用户信息
export function getUserInfo (params) {
  return service({
    url: `/static/resource/userInfo.json`,
    type: 'GET',
    params
  })
}
// 获取用户详细信息
export function getUserDetailInfo (params) {
  return service({
    url: `/static/resource/userDetail.json`,
    type: 'GET',
    params
  })
}
