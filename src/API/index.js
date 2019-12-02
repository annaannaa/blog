import axios from '../util/http'
// 匹配接口

export default {
  //注册
  postRegister (data) {
    return axios.post('/api/blog/regisert', data)
  },

  //登陆
  postLogin (data) {
    return axios.post('/api/blog/login', data)
  },

  //系统博客类型
  getBlogType (data) {
    return axios.get('/api/blog/getType', {
      params: data
    })
  },

  //系统标签
  getBlogTag (data) {
    return axios.get('/api/blog/getTag', {
      params: data
    })
  },

  //保存
  save (data) {

    return axios.post('/api/blog/create',
      data
    )
  },

  //我的博客列表
  getMyBlogList (data) {
    return axios.get('/api/blog/myBlog', {
      params: data
    }
    )

  },

  //展示博客列表
  getBlogList (data) {
    return axios.get('/api/blog/search', {
      params: data
    }
    )

  },
  //test
  test (data) {
    return axios.post('/api/test',
      data
    )
    //return axios.post('/api/blog/regisert', data)
  }


}
