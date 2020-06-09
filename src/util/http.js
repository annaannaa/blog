import axios from 'axios'
import store from '../store'
import { Message } from 'element-ui';
// import ip from './ipConfig'

// axios 配置
axios.defaults.timeout = 5000
// 调用数据接口
let protocol = window.location.protocol
let host = window.location.host // 主机
let reg = /^localhost+/
if (reg.test(host)) {
  // 若本地项目调试使用
  // axios.defaults.baseURL = protocol + '//' + host
} else {
  // 动态请求地址 发布
  axios.defaults.baseURL = protocol + '//' + host
}


// http request拦截器 传递token
axios.interceptors.request.use(
  config => {
    store.dispatch('loading/showLoading');
    const token = sessionStorage.getItem('apiToken')
    //config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json',
      "Access-Control-Max-Age": "1800",
      'api_token': "g6O1B2rVE8CwkJhJprNDk2GO8O6EKODznUG1uU4xQcc3ZKQZv4NqlUedwCt3"
    }
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  err => {
    Message.error('访问服务错误')
    store.dispatch('loading/hideLoading');
    return Promise.reject(err)
  }
)

// http response 拦截器（所有接收到的请求都要从这儿过一次）
axios.interceptors.response.use(
  response => {
    if (response.status === 401) {
      this.$router.push({
        path: '/login'
      })
    }

    if (response.data.hasOwnProperty('msg_code')) {
      if (response.data.msg_code != 0) {
        if (response.data.hasOwnProperty('msg'))
          Message.error(response.data.msg[0])
      } else {
        if (response.data.hasOwnProperty('msg'))
          if (typeof (response.data.msg) == "string") {
            Message.success(response.data.msg || '成功')
          }
        if (typeof (response.data.msg) == "object") {
          Message.success(response.data.msg[0])
        }

      }
    }


    store.dispatch('loading/hideLoading');
    return response
  },
  error => {

    Message.error('服务返回错误')
    store.dispatch('loading/hideLoading');
    return Promise.reject(error.response.data)

  })

export default axios

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get (url, params = {}) {
  console.log(url)

  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// return new Promise((resolve, reject) => {
//   axios.get(url, {
//     params: params
//   })
//     .then(response => {
//       resolve(response.data)
//     })
//     .catch(err => {
//       reject(err)
//     })
// })
/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
