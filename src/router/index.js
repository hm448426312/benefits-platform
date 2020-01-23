import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/index'
import store from '../store/index'

Vue.use(Router)

const router = [
  {
    path: '/demo',
    name: 'Demo',
    component: (resolve) => require(['@/pages/Demo'], resolve)
  },
  {
    path: '/home',
    name: '首页',
    component: (resolve) => require(['@/pages/home'], resolve)
  },
  {
    path: '/page',
    name: '',
    component: Layout,
    redirect: '/page/user-center',
    children: [
      {
        path: 'user-center/auth',
        name: '企业认证',
        component: (resolve) => require(['@/pages/user-center/auth'], resolve),
        meta: {
          fullPath: '/page/user-center/auth',
          title: '企业认证',
          code: 'user-center-auth',
          hide: true
        }
      },
      {
        path: 'user-center',
        name: '个人中心',
        component: (resolve) => require(['@/pages/user-center'], resolve),
        meta: {
          fullPath: '/page/user-center',
          title: '个人中心',
          code: 'user-center'
        }
      },
      {
        path: 'goods-manage',
        name: '商品分类管理',
        component: (resolve) => require(['@/pages/goods-manage'], resolve),
        meta: {
          fullPath: '/page/goods-manage',
          title: '商品分类管理',
          code: 'goods-manage'
        }
      },
      {
        path: 'enterprise-manage/review',
        name: '企业认证审核',
        component: (resolve) => require(['@/pages/enterprise-manage/enterprise-detail'], resolve),
        meta: {
          fullPath: '/page/enterprise-manage/review',
          title: '企业认证审核',
          code: 'enterprise-manage-review'
        }
      },
      {
        path: 'enterprise-manage',
        name: '企业管理',
        component: (resolve) => require(['@/pages/enterprise-manage'], resolve),
        meta: {
          fullPath: '/page/enterprise-manage',
          title: '企业管理',
          code: 'enterprise-manage'
        }
      },
      {
        path: 'goods-list',
        name: '商品列表',
        component: (resolve) => require(['@/pages/goods-list'], resolve),
        meta: {
          fullPath: '/page/goods-list',
          title: '商品列表',
          code: 'goods-list'
        }
      },
      {
        path: 'order-list',
        name: '订单列表',
        component: (resolve) => require(['@/pages/order'], resolve),
        meta: {
          fullPath: '/page/order-list',
          title: '订单列表',
          code: 'order-list'
        }
      },
      {
        path: 'invoice-manage',
        name: '发票管理',
        component: (resolve) => require(['@/pages/invoice'], resolve),
        meta: {
          fullPath: '/page/invoice-manage',
          title: '发票管理',
          code: 'invoice-manage'
        }
      }
    ]
  },
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '**',
    redirect: '/home'
  }
]

store.commit('setMenu', router)
export default new Router({
  mode: 'history',
  routes: router
})
