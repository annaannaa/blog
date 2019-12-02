<template>
  <div class="list">
    <div class="searchBox">
      <div class="input">
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
         style="overflow:auto">
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
                <div class="title">{{blog.blogTitle}}</div>

              </div>
              <!-- <div class="title">{{blog.blogTitle}}</div> -->
              <div class="content">{{blog.blogContent}}</div>
            </el-card>

          </div>

        </li>
      </ul>
      <!-- <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p> -->
    </div>

  </div>
</template>



<script>
export default {
  name: 'blogList',
  data () {
    return {
      isActive: true,
      count: 10,
      loading: false,
      blogSearch: {
        search: '',
        index: 1,
        pagecount: 10,
        blogtypeId: '',
        type: 0,
        api_token: ''
      },
      blogContent: [],
      //系统类型
      systemBlogType: []

    }
  },
  computed: {
    noMore () {
      return this.count >= 20
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted () {
    if (window.sessionStorage.getItem('apiToken')) {
      this.blogSearch.api_token = window.sessionStorage.getItem('apiToken')
    }

    this.$API.test({ api_token: this.blogSearch.api_token }).then(res => {
      // this.blogContent = res.data.data
    }).catch(err => {
      console.log(err)
    })
    //系统类型
    this.$API.getBlogType({ 'api_token': this.blogSearch.api_token }).then(
      res => {
        this.systemBlogType = res.data.data
      }
    ).catch(err => {
      console.log(err)
    })

    //获取列表
    this.$API.getBlogList(this.blogSearch).then(res => {
      this.blogContent = res.data.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    },
    //搜索框查询
    querySearchAsync () {

    },
    search (parm) {
      if (parm == 'time') {
        this.isActive = true
        this.blogSearch.type = 1
      }
      else if (parm == 'hot') {
        this.isActive = false
        this.blogSearch.type = 0
      }
      this.$API.getBlogList(this.blogSearch).then(res => {
        this.blogContent = res.data.data
      }).catch(err => {
        console.log(err)
      })

    },
    handleSelect () { }
  }
}
</script>

<style lang="less" scoped>
.list {
  float: left;
  width: 70%;
  padding: 20px 0px;
  .searchBox {
    .input {
      float: left;
      width: 50%;
    }
    .span {
      height: 40px;
      float: left;
      width: 50%;
      line-height: 40px;
      .isActive {
        background: #ffffff;
        border-color: #409eff;
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
  li {
    padding: 20px;
    .el-card {
      .title {
        text-align: left;
        font-weight: 700;
      }
      .content {
      }
    }
  }
}
</style>