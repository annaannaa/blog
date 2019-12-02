<template>
  <div class="wrapper">
    <div class="top">
      <div>
        <div style="width: 200px;float:left">
          <el-page-header class="returnBtn"
                          @back="goBack">
          </el-page-header>
          <span>查博 我的博客</span>
        </div>
        <el-alert v-if="!loginSate"
                  style="position:absolute;top:0;left:200px;width: 80%;"
                  title="还没有登录 将无法保存"
                  type="warning">
        </el-alert>
      </div>
    </div>

    <div class="search">
      <!-- 搜索框 -->
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容"
                  v-model="input3"
                  class="input-with-select">
          <el-select v-model="select"
                     slot="prepend"
                     placeholder="请选择">
            <el-option label="餐厅名"
                       value="1"></el-option>
            <el-option label="订单号"
                       value="2"></el-option>
            <el-option label="用户电话"
                       value="3"></el-option>
          </el-select>
          <el-button slot="append"
                     icon="el-icon-search">我的博客</el-button>
        </el-input>
      </div>
    </div>

    <div class="content">
      <ul>
        <li v-for="i in 20">

          <el-card class="box-card"
                   shadow="hover">
            <div slot="header"
                 class="clearfix">
              <span>title</span>
              <div class="buttonBox">
                <i class="el-icon-edit"></i>
                <i class="el-icon-minus"></i>
              </div>
            </div>
            neirong
          </el-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  mounted () {
    // 获取我的博客类型
    this.$API.getBlogType({ 'api_token': this.blogSearch.api_token }).then(
      res => {
        this.myBlogType = res.data.data
      }
    ).catch(err => {
      console.log(err)
    })

    //api-token
    if (window.sessionStorage.getItem('apiToken')) {
      this.$store.commit('ChangeLogin', true)
      this.blogSearch.api_token = window.sessionStorage.getItem('apiToken')
    }
    //博客列表

  },
  data () {
    return {
      //查询
      blogSearch: {
        apiToken: ''
      },
      //博客列表
      blogList: [],
      //博客类型
      myBlogType: []
    }
  },
  computed: {
    ...mapState({
      loginSate: 'loginSate'
    })
  },
  methods: {
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }

}
</script>

<style lang="less" scoped>
.wrapper {
  top: 10px;
  height: 100%;
  .top {
    height: 10%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    .returnBtn {
      display: inline-block;
      text-align: left;
      float: left;
    }
    // .saveBtn {
    //   display: inline-block;
    //   cursor: pointer;
    //   float: right;
    // }
    &::after {
      content: "";
      clear: both;
      display: block;
    }
  }
  .search {
    width: 80%;
    margin: 0 auto;
    height: 60px;
    .el-input-group {
      height: 60px;

      /deep/.el-input__inner {
        height: 59px;
      }
    }
  }

  .content {
    width: 80%;
    margin: 0 auto;
    li {
      padding: 20px 0;
      .el-card {
        /deep/.el-card__header {
          position: relative;
          .buttonBox {
            position: absolute;
            right: 0;
            top: 0;
            i {
              font-size: 20px;
              cursor: pointer;
              padding: 0 10px;
              line-height: 55px;
            }
          }
        }
      }
    }
  }
}
</style> 

