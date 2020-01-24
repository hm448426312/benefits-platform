/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取用户信息
export function getOrderList (params) {
  return service({
    url: `/static/resource/orderList.json`,
    type: 'GET',
    params
  })
}
