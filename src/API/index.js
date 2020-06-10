import axios from '../util/http'
//import Axios from 'axios'
// 匹配接口

//test 启用Mock 假数据   
var tag = 'Test';
if (tag == 'Test') {
  window.sessionStorage.setItem("apiToken", 'Test')
}

export default {

  //
  test (data) {
    console.log('testtest')
    return axios.get('/msg1', {
      params: data
    })

  },

  //注册
  postRegister (data) {
    return axios.post('/api/blog/regisert', data)
  },

  //登陆
  postLogin (data) {
    if (tag == "Test") {
      data = ''
    }
    return axios.post('/api/blog/login', data)

  },

  //系统博客类型
  getBlogType (data) {
    if (tag == "Test") {
      data = ''
    }
    return axios.get('/api/blog/getType', {
      params: data
    })
  },

  //标签
  getBlogTag (data) {
    if (tag == "Test") {
      data = ''
    }
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
    if (tag == "Test") {
      data = ''
    }
    return axios.get('/api/blog/myBlog', {
      params: data
    }
    )

  },

  //展示博客列表
  getBlogList (data) {
    if (tag == "Test") {
      data = ''
    }
    return axios.get('/api/blog/search', {
      params: data
    }
    )




  },
  //搜索博客标题
  getBlogTitle (data) {
    return axios.get(' api/blog/BlogTitle', {
      params: data
    }
    )
  },

  //搜索我的博客标题
  getMyBlogTitle (data) {
    return axios.get(' /api/blog/MyBlogTitle', {
      params: data
    }
    )
  },
  //博客详情
  ///api/blog/getBlogInfo
  getBlogInfo (data) {
    if (tag == "Test") {
      data = ''
    }
    return axios.get('/api/blog/getBlogInfo', {
      params: data
    }
    )

  },

  //上传图片 /api/blog/ImgUp
  uploadImage (data, api_token) {
    return axios({
      method: 'post',
      url: `/api/blog/ImgUp?api_token=${api_token}`,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        "Access-Control-Max-Age": "1800",
        // 'api_token': "g6O1B2rVE8CwkJhJprNDk2GO8O6EKODznUG1uU4xQcc3ZKQZv4NqlUedwCt3"
      }
    })
    // return new Promise((resolve, reject) => {
    //   Axios.post(`/api/blog/ImgUp?api_token=${api_token}`, data)
    //     .then(response => {
    //       resolve(response.data)
    //     }, err => {
    //       reject(err)
    //     })
    //   }

  },

  //修改博客
  ///api/blog/change
  changeBlog (data) {
    return axios.post('/api/blog/change',
      data
    )
  },

  //新增评论
  ///（post）10.20.38.251:8000/api/blog/Comment
  addComment (data) {
    return axios.post('/api/blog/Comment',
      data
    )
  },

  //点赞 踩
  //（get）10.20.38.251:8000/api/blog/LikeOnLike
  LikeOnLike (data) {
    return axios.get('/api/blog/LikeOnLike', {
      params: data
    }
    )
  },

  //删除评论
  delComment (data) {
    return axios.post('/api/blog/DelComment', data

    )
  },

  //删除博客
  delBlog (data) {
    return axios.get('/api/blog/Delete', {
      params: data
    }
    )
  },

  //历史记录

  getBlogHistory (data) {
    return axios.get('/blog/history', {
      params: data
    })
  }



}
