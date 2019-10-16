import axios from '../util/http'
// 匹配接口

export default {
  postRegister (data) {
    return axios.post('/api/blog/regisert', data)
  },

  postLogin (data) {
    return axios.post('/api/blog/login', data)
  }

}
