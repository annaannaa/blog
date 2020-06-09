<template>
  <div class="blogList">

    <div id="searchBox"
         class="searchBox"
         ref="searchBox">

      <div class="input">
        <label for="">标题：</label>
        <el-autocomplete v-model="blogSearch.search"
                         :fetch-suggestions="querySearchAsync"
                         placeholder="请输入内容"
                         @select="handleSelect"></el-autocomplete>
        <el-select v-model="blogSearch.blogtypeId"
                   placeholder="类型">
          <el-option v-for="item in systemBlogType"
                     :key="item.blogTypeOnlyId"
                     :label="item.name"
                     :value="item.blogTypeOnlyId">
          </el-option>
        </el-select>
        <el-button icon="el-icon-search"
                   @click="search('search')"
                   plain></el-button>
      </div>
      <div class="span">

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

    </div>
    <div class="infinite-list-wrapper"
         style="overflow:auto;position: relative;">
      <loading></loading>
      <el-scrollbar>

        <ul class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
          <li v-for="blog in blogContent"
              class="list-item"
              :key="blog.id">
            <div>
              <el-card shadow="hover">
                <div slot="header"
                     class="clearfix">
                  <router-link :to="{name:'blogInfo',query:{'blogId':blog.blogOnlyId}}"
                               class="link">
                    <div class="title">{{blog.blogTitle}}</div>
                    <div class="RightAuthorInfo">
                      <el-avatar class="image"
                                 src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                      <span>{{blog.name}}</span>
                    </div>
                  </router-link>

                </div>
                <!-- <div class="title">{{blog.blogTitle}}</div> -->
                <div class="content"
                     v-html="blog.blogContent"></div>
              </el-card>

            </div>

          </li>
        </ul>
        <!-- <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p> -->
      </el-scrollbar>

    </div>

  </div>
</template>



<script>
import loading from '../components/loading/loading'
export default {
  name: 'blogList',
  data () {
    return {
      isActive: true,
      count: 10,
      loading: false,
      blogSearch: {
        search: '',
        index: 0,
        pagecount: 10,
        blogtypeId: '',
        type: 0,
        api_token: ''
      },
      total: 100,
      blogContent: [],
      //系统类型
      systemBlogType: [{
        blogTypeOnlyId: '',
        name: '全部'
      }],

    }
  },
  components: {
    loading
  },
  computed: {
    noMore () {
      return this.blogSearch.index * this.blogSearch.pagecount >= this.total
    },
    disabled () {
      return this.noMore
    }
  },
  mounted () {


    if (window.sessionStorage.getItem('apiToken')) {
      this.blogSearch.api_token = window.sessionStorage.getItem('apiToken')
    } else {
      this.$router.push('login')
    }

    //系统类型
    this.$API.getBlogType({ 'api_token': this.blogSearch.api_token }).then(
      res => {
        res.data.data.forEach(
          data => {
            this.systemBlogType.push(data)
          }
        )
        //  this.systemBlogType = res.data.data
        console.log("systemBlogType", this.systemBlogType)
        this.$store.commit('putSysBlogType', this.systemBlogType)
        window.sessionStorage.setItem("systemBlogType", JSON.stringify(this.systemBlogType))
      }
    ).catch(err => {
      console.log(err)
    })



    //监听滚动条 searchbox移动到顶部时加上阴影
    // window.addEventListener('mousewheel', this.handleScroll, false)

  },
  methods: {
    load () {
      //获取列表
      this.blogSearch.index++;
      this.loading = true;
      this.$API.getBlogList(this.blogSearch).then(res => {
        if (res.data.data) {
          res.data.data.forEach(element => {
            this.blogContent.push(element)
          });
        }


        this.total = res.data.blogNum

      }).catch(err => {
        console.log(err)
      })

    },
    //搜索框查询
    querySearchAsync (query, callback) {
      // console.log('query', query)
      this.$API.getBlogTitle({ api_token: this.blogSearch.api_token, title: query }).then(
        res => {
          console.log(res.data)
          //var data = [{ value: 1 }, { value: 2 }]
          callback(res.data.data)
        }
      )
    },
    //搜索按钮
    search (parm) {
      if (parm == 'time') {
        this.isActive = true
        this.blogSearch.type = 1
        this.blogSearch.index = 1;
      }
      else if (parm == 'hot') {
        this.isActive = false
        this.blogSearch.type = 0
        this.blogSearch.index = 1;
      }
      else if (parm == 'search') {
        this.blogSearch.index = 1;
      }
      this.$API.getBlogList(this.blogSearch).then(res => {
        this.total = res.data.blogNum
        this.blogContent = res.data.data
      }).catch(err => {
        console.log(err)
      })

    },
    handleSelect () { },
    //处理滚动条
    // handleScroll () {
    //   // console.log(this.$refs.searchBox.offsetTop)
    //   // if (this.$refs.searchBox.offsetTop > 480) {
    //   //   this.$refs.searchBox.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)"
    //   // }
    //   // else {
    //   //   this.$refs.searchBox.style.boxShadow = "none"
    //   // }
    // }

  }
}
</script>

<style lang="less" scoped>
.blogList {
  float: left;
  width: 100%;

  overflow-y: scroll;
  background: #ffffff;
  //height: calc(100vh - 200px);
  .searchBox {
    width: 100%;
    min-width: 1200px;
    position: sticky;
    top: 0;
    height: 100px;
    line-height: 100px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .input {
      float: left;
      //  width: 50%;
      min-width: 600px;
    }
    .span {
      float: left;
      min-width: 600px;

      .isActive {
        background: #ffffff;
        //  border-color: red;
        color: #409eff;
      }
      span {
        cursor: 123;
      }
    }
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .el-scrollbar {
    width: 100%;
    position: relative;
    height: calc(100vh - 350px);
    ul {
      // height: calc(100vh - 300px);
      li {
        padding: 20px;
        .el-card {
          /deep/ .link {
            display: flex;
            justify-content: space-between;
            color: #000;
            .title {
              text-align: left;
              font-weight: 700;
              cursor: pointer;
              color: #000;
            }
            .RightAuthorInfo {
              height: 40px;
              line-height: 40px;
              span {
                vertical-align: top;
              }
            }
          }
          .content {
            text-align: left;
            color: #606266;
          }
        }
      }
    }
  }
}
.blogList::-webkit-scrollbar {
  display: none;
}

/deep/ .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>