import axios from 'axios'

/**
 * 定义请求常量
 * TIME_OUT
 */
const TIME_OUT = 1000 // 请求超时时间
const baseUrl = process.env.BASE_URL // 引入全局url，定义在全局变量process.env中

const service = axios.create({
  baseURL: baseUrl,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: TIME_OUT // request timeout
})

// 封装请求拦截
service.interceptors.request.use(
  config => {
    if (config.method.toLowerCase() === 'get') {
      if (config.params) {
        config.params['_'] = new Date().getTime()
      } else {
        config.params = {
          '_': new Date().getTime()
        }
      }
    }
    // let token = localStorage.getItem('token')   // 获取token
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // config.headers['Authorization'] = ''
    // if(token != null){                          // 如果token不为null，否则传token给后台
    // config.headers['Authorization'] = token
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 封装响应拦截，判断token是否过期
service.interceptors.response.use(
  response => {
    // let {data} = response
    // if (data.message === 'token failure!') { // 如果后台返回的错误标识为token过期，则重新登录
    //   localStorage.removeItem('token') // token过期，移除token
    //   // 进行重新登录操作
    // } else {
    //   return Promise.resolve(response)
    // }
    return Promise.resolve(response)
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
