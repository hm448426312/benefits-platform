// 角色对应路由权限
export const rightRouter = {
  // 管理员
  'ADMIN': [
    'home', // 首页
    'user-center', // 个人中心
    'user-center-auth', // 企业认证
    'goods-manage', // 商品管理
    'enterprise-manage', // 企业管理
    'goods-list', // 商品列表
    'order-list', // 订单列表
    'invoice-manage' // 发票管理
  ],
  // 渠道
  'CHANNEL': [
    'home', // 首页
    'user-center', // 个人中心
    'user-center-auth', // 企业认证
    'enterprise-manage', // 企业管理
    'order-list', // 订单列表
    'invoice-manage' // 发票管理
  ],
  // 企业
  'ENTERPRISE': [
    'home', // 首页
    'user-center', // 个人中心
    'user-center-auth', // 企业认证
    'goods-list', // 商品列表
    'order-list', // 订单列表
    'invoice-manage' // 发票管理
  ]
}

export const authStatus = {
  unAuth: 'un-auth', // 未认证
  authIng: 'auth-ing', // 认证中
  authEd: 'auth-ed', // 认证成功
  authError: 'auth-error', // 认证失败
  stopUse: 'disabled'
}
