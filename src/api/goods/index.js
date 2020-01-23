/**
 * @param params
 * @returns {*}
 */
import service from '../../api-config/index'
// 获取商品大类
export function getGoodsClassify (params) {
  return service({
    url: `/static/resource/goodsClassify.json`,
    type: 'GET',
    params
  })
}
// 获取商品子类
export function getGoodsSubClassify (params) {
  return service({
    url: `/static/resource/goodsSubClassify.json`,
    type: 'GET',
    params
  })
}
// 获取商品列表
export function getGoodsList (params) {
  return service({
    url: `/static/resource/goodsManageList.json`,
    type: 'GET',
    params
  })
}
