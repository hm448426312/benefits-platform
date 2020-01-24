/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取用户信息
export function getInvoiceList (params) {
  return service({
    url: `/static/resource/invoiceList.json`,
    type: 'GET',
    params
  })
}
