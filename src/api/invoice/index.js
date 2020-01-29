/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取发票抬头列表
export function getInvoiceList (params) {
  return service({
    url: `/static/resource/invoiceList.json`,
    type: 'GET',
    params
  })
}
