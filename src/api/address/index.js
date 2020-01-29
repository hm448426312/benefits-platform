/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取收件地址列表
export function getAddressList (params) {
  return service({
    url: `/static/resource/addressList.json`,
    type: 'GET',
    params
  })
}
