export default {

  //登录
  ChangeLogin (state, IsLogin) {
    state.loginSate = IsLogin
  },

  //存储系统类型
  putSysBlogType (state, sysBlogType) {
    state.systemBlogType = sysBlogType;
  }
}
