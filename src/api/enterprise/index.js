/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取企业列表
export function getEnterpriseList (params) {
  return service({
    url: `/static/resource/enterpriseList.json`,
    type: 'GET',
    params
  })
}
