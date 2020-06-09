<template>
  <div style="height:100%">
    <div class="wrapper">
      <pageTop title="查博"></pageTop>

      <div class="search">
        <!-- 搜索框 -->

        <!-- <el-input placeholder="请输入内容"
                      v-model="input"
                      class="input-with-select"> -->
        <el-select v-model="myBlogType"
                   slot="prepend"
                   placeholder="请选择">
          <el-option v-for="item in myBlogTypeList"
                     :key="item.blogTypeOnlyId"
                     :label="item.name"
                     :value="item.blogTypeOnlyId">
          </el-option>
        </el-select>
        <el-autocomplete v-model="blogSearch.title"
                         :fetch-suggestions="querySearchAsync"
                         placeholder="请输入内容"></el-autocomplete>

        <el-button slot="append"
                   icon="el-icon-search"
                   @click="search('search')">我的博客</el-button>

      </div>

      <!-- 附加搜索框 -->
      <div class="search1">

        <el-radio v-model="blogSearch.isGood"
                  @change="search"
                  label='0'>正常</el-radio>
        <el-radio v-model="blogSearch.isGood"
                  @change="search"
                  label='1'>异常</el-radio>
        <el-button icon='el-icon-top'
                   plain
                   :class="{isActive:isActive}"
                   @click="
                   search('time')">按时间</el-button>
        <el-button icon='el-icon-top'
                   plain
                   :class="{isActive:!isActive}"
                   @click="search('hot')">按热度</el-button>
      </div>

      <div class="content">
        <div class="infinite-list-wrapper"
             style="overflow:auto">
          <el-scrollbar style="height:calc(100% - 250px)">
            <ul class="list"
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled">
              <li v-for="blog in blogList"
                  :key="blog.id">

                <el-card class="box-card"
                         shadow="hover">
                  <div slot="header"
                       class="clearfix">
                    <router-link :to="{name:'blogInfo',query:{'blogId':blog.blogOnlyId}}">
                      <span>{{blog.blogTitle}}</span>
                    </router-link>
                    <div class="buttonBox">
                      <router-link :to="{name:'writeBlog',query:{'blogId':blog.blogOnlyId}}">
                        <el-button icon='el-icon-edit'
                                   plain> </el-button>
                      </router-link>
                      <el-button @click="DelBlog(blog.blogOnlyId)"> <i class="el-icon-minus"></i></el-button>

                    </div>
                  </div>
                  <div v-html="blog.blogContent"></div>
                  <div class="el-badge">
                    <!-- <el-badge :value="12"
                              class="item">
                      <el-button size="small">评论</el-button>
                    </el-badge> -->
                    <span style="padding:5px">阅读数:{{blog.readNum}}</span>
                    <span style="padding:5px">
                      <i class="fa fa-thumbs-o-up"
                         aria-hidden="true"></i>
                      {{blog.likeNum}}
                    </span>
                  </div>

                </el-card>
              </li>
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </el-scrollbar>

        </div>
      </div>
      <!-- 回到顶部 -->
      <el-backtop target=".el-scrollbar .el-scrollbar__wrap"
                  :bottom="100">

      </el-backtop>

    </div>

  </div>
</template>

<script>
import top from '../components/top'
import { mapState } from 'vuex'
import { get } from 'http'
export default {
  components: {
    pageTop: top
  },
  mounted () {
    //api-token
    if (window.sessionStorage.getItem('apiToken')) {
      this.$store.commit('ChangeLogin', true)
      this.blogSearch.api_token = window.sessionStorage.getItem('apiToken')
    }

    // 获取我的博客类型
    if (window.sessionStorage.getItem('systemBlogType')) {
      JSON.parse(window.sessionStorage.getItem('systemBlogType')).forEach(el => {
        this.myBlogTypeList.push(el)
      })
    }
    // this.$API.getBlogType({ 'api_token': this.blogSearch.api_token }).then(
    //   res => {
    //     this.myBlogTypeList = res.data.data
    //     this.loading = false
    //     console.log(this.myBlogTypeList)
    //   }
    // ).catch(err => {
    //   console.log(err)
    // })

  },
  data () {
    return {
      //正常 异常
      // IsNomal

      blogSearch: {
        index: 0,
        pagecount: 10,
        blogtypeId: '',
        type: 1,//时间先后
        isGood: '0',//正常
        api_token: '',
        title: ''
      },
      //博客列表
      blogList: [],
      //博客类型
      myBlogType: '',
      myBlogTypeList: [],
      input: '',
      isActive: true,
      loading: false,
      total: 100,
      type: ""

    }
  },
  computed: {

    noMore () {

      return this.blogSearch.index * this.blogSearch.pagecount >= this.total && !this.loading
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    init () {
      //博客列表
      this.blogSearch.index = 1
      this.$API.getMyBlogList(this.blogSearch).then(
        res => {
          this.blogList = res.data.data
          this.total = res.data.blogNum
        }
      ).catch(err => {
        console.log(err)
      })

    },

    load () {
      this.blogSearch.index++
      this.loading = true
      this.$API.getMyBlogList(this.blogSearch).then(
        res => {
          res.data.data.forEach(element => {
            this.blogList.push(element)
          });
          this.total = res.data.blogNum
          this.loading = false

        }
      ).catch(err => {
        console.log(err)
      })

    },
    search (type) {
      this.blogSearch.index = 1
      this.type = type
      if (type == 'time') {
        this.blogSearch.type = 1
        this.blogSearch.index = 1
        this.isActive = true
      }
      else if (type == "hot") {
        this.blogSearch.type = 0
        this.blogSearch.index = 1
        this.isActive = false
      }
      else if (type == "search") {
        this.blogSearch.index = 1
      }
      console.log(this.blogSearch)
      this.blogSearch.blogtypeId = this.myBlogType;
      this.$API.getMyBlogList(this.blogSearch).then(
        res => {
          this.blogList = res.data.data

          this.total = res.data.blogNum

        }
      ).catch(err => {
        console.log(err)
      })
    },
    querySearchAsync (query, callback) {
      // console.log('query', query)
      this.$API.getMyBlogTitle({ api_token: this.blogSearch.api_token, title: query }).then(
        res => {
          console.log(res.data)
          //var data = [{ value: 1 }, { value: 2 }]
          callback(res.data.data)
        }
      )
    },
    DelBlog (blogId) {
      this.$API.delBlog({ api_token: this.blogSearch.api_token, blogId: blogId }).then(
        res => {
          if (res.data.msg_code == 0) {
            this.search(this.type);
          }
        }
      )
    }
  }

}
</script>

<style lang="less" scoped>
.wrapper {
  top: 10px;
  height: 100%;

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

  .search1 {
    box-shadow: 0px 15px 10px -15px #ccc;
    padding: 10px 0 20px;
    z-index: 9999;

    .isActive {
      background: #ffffff;
      //  border-color: red;
      color: #409eff;
    }
  }

  .content {
    width: 100%;
    margin: 0 auto;
    height: 100%;
    .infinite-list-wrapper {
      height: 100%;
      &::after {
        display: block;
        clear: both;
        content: "";
      }
      ul {
        //  height: 2000px;
        //height: 900px;
        padding: 0 5%;
      }
      li {
        padding: 20px 0;
        .el-card {
          /deep/.el-card__header {
            position: relative;
            text-align: left;
            span {
              font-weight: 700;
              cursor: pointer;
              color: #000;
            }
            .buttonBox {
              position: absolute;
              right: 0;
              top: 0;
              height: 55px;
              button {
                height: 100%;
              }
              // i {
              //   font-size: 20px;
              //   cursor: pointer;
              //   padding: 0 10px;
              //   line-height: 55px;
              // }
            }
          }
          /deep/.el-card__body {
            height: 200px;
            text-align: left;
            position: relative;
            .el-badge {
              position: absolute;
              right: 5%;
              bottom: 0;
              padding: 5px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}

/deep/ .el-scrollbar {
  height: calc(100% - 200px);
}
/deep/ .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style> 

