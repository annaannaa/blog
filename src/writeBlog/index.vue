<template>
  <div class="wrapper">
    <div class="top">
      <div>
        <div style="width: 130px;float:left">
          <el-page-header class="returnBtn"
                          @back="goBack">
          </el-page-header>
          <span>写博</span>
        </div>
        <el-alert v-if="!loginSate"
                  style="position:absolute;top:0;left:200px;width: 80%;"
                  title="还没有登录 将无法保存"
                  type="warning">
        </el-alert>

        <div class="saveBtn"
             style="float:right"
             @click="save">保存
          <i class="el-icon-finished"></i>
        </div>
      </div>
      <!-- <span>arrow 返回上一页</span>
      <span>your Name</span> -->
    </div>
    <div class="content">
      <div class="arrow "
           @click="openLeftBox=!openLeftBox">
        <i :class="[{'el-icon-arrow-left':openLeftBox},{'el-icon-arrow-right':!openLeftBox}]"></i>
      </div>

      <div v-if="openLeftBox"
           class="leftStatue">
        <div class="itemBox infinite-list"
             v-infinite-scroll="load"
             style="overflow:auto">
          <ul v-for="itemDate in pageLink"
              :key="itemDate.index"
              class="pageUl">
            <li class="date">
              <i class="el-icon-date"></i>
              {{itemDate.date}}</li>
            <li class="pageItem"
                v-for="item in itemDate.page"
                :key="item.index">
              {{item.name}}
            </li>
          </ul>
        </div>
      </div>
      <div class="textEditor"
           :class="{textEditFull:!openLeftBox}">

        <quill-editor class="editor"
                      ref="myTextEditor"
                      v-model="blogForm.blogContent">
        </quill-editor>

      </div>
    </div>
    <!-- 弹出层 -->
    <div class="dialog">
      <el-dialog title="保存博客"
                 :visible.sync="saveBlogDialog">
        <el-form :model="blogForm"
                 ref="from"
                 label-width="150px">
          <el-form-item label="标题">
            <el-input v-model="blogForm.title"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="系统类别">
            <el-select v-model="blogForm.blogType"
                       placeholder="请选择活动区域"
                       style="width:100%">
              <el-option v-for="item in systemBlogType"
                         :key="item.blogTypeOnlyId"
                         :label="item.name"
                         :value="item.blogTypeOnlyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户自定义类别">
            <el-select v-model="blogForm.blogUserType"
                       style="width:100%"
                       placeholder="请选择活动区域">
              <el-option v-for="item in blogUserType"
                         :key="item.blogTypeOnlyId"
                         :label="item.name"
                         :value="item.blogTypeOnlyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="blogForm.blogTag"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       placeholder="请选择或输入标签"
                       style="width: 100%;">
              <el-option v-for="item in blogTagOptions"
                         :key="item.content"
                         :label="item.content"
                         :value="item.content">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='是否公开'>
            <el-checkbox v-model="blogForm.isPublic"></el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="saveBlogDialog = false">取 消</el-button>
          <el-button type="primary"
                     @click="saveOk">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  mounted () {
    // 获取系统博客类型
    if (window.sessionStorage.getItem('apiToken')) {
      this.$store.commit('ChangeLogin', true)
      this.blogForm.api_token = window.sessionStorage.getItem('apiToken')
    }
    this.$API.getBlogType({ 'api_token': this.blogForm.api_token }).then(
      res => {
        this.systemBlogType = res.data.data
        this.blogUserType = res.data.udata
      }
    ).catch(err => {
      console.log(err)
    })
    //获取系统标签
    this.$API.getBlogTag({ 'api_token': this.blogForm.api_token }).then(
      res => {
        this.blogTagOptions = res.data.data;
      }
    ).catch(err => {
      console.log(err)
    })
    //获取我的博客
    this.$API.getMyBlogList({      index: 1,
      pagecount: 10,
      blogtypeId: '',
      type: 1,
      isGood: 0,
      api_token: this.blogForm.api_token
    }).then(
      res => {
        this.myBlogList = res.data.data;
      }
    ).catch(err => {
      console.log(err)
    })
  },

  data () {
    return {
      content: '',
      // 左边文章栏开关
      openLeftBox: true,
      // 博客文章列表
      pageLink: [
        {
          index: 1,
          date: '2019 - 1 - 3',
          page: [
            {
              index: 1,
              name: '如何实现浏览器跨域，php'
            },
            {
              index: 2,
              name: '如何实现浏览器跨域，php'
            }
          ]
        },
        {
          index: 2,
          date: '2019 - 9 - 3',
          page: [
            {
              index: 1,
              name: '我是第二条测试数据，我测试文本长度过长会如何处理，我在加长，加长'
            },
            {
              index: 2,
              name: '如何实现浏览器跨域，php'
            }
          ]
        },
        {
          index: 3,
          date: '2019 - 9 - 3',
          page: [
            {
              index: 1,
              name: '我是第二条测试数据，我测试文本长度过长会如何处理，我在加长，加长'
            },
            {
              index: 2,
              name: '如何实现浏览器跨域，php'
            }
          ]
        },
        {
          index: 4,
          date: '2019 - 9 - 3',
          page: [
            {
              index: 1,
              name: '我是第二条测试数据，我测试文本长度过长会如何处理，我在加长，加长'
            },
            {
              index: 2,
              name: '如何实现浏览器跨域，php'
            }
          ]
        },
        {
          index: 5,
          date: '2019 - 9 - 3',
          page: [
            {
              index: 1,
              name: '我是第二条测试数据，我测试文本长度过长会如何处理，我在加长，加长'
            },
            {
              index: 2,
              name: '如何实现浏览器跨域，php'
            }
          ]
        },
        {
          index: 6,
          date: '2019 - 9 - 3',
          page: [
            {
              index: 1,
              name: '我是第二条测试数据，我测试文本长度过长会如何处理，我在加长，加长'
            },
            {
              index: 2,
              name: '如何实现浏览器跨域，php'
            }
          ]
        }
      ],
      // 系统规定的博客类型
      systemBlogType: [],
      //用户自定义类别
      blogUserType: [],
      // 保存博客
      // 弹框显示
      saveBlogDialog: false,

      // 弹框From
      blogForm: {
        title: '',
        blogType: '',
        blogContent: '',
        blogUserType: '',
        blogTag: [],
        isPublic: true,
        api_token: ''

      },
      //博客标签
      blogTagOptions: [
      ],
      //我的博客列表
      myBlogList: []

    }
  },
  computed: {
    ...mapState({
      loginSate: 'loginSate'
    })
  },

  methods: {

    save () {
      if (!this.loginSate) {
        this.$message.error(
          "您还没登录呢"
        )
        return
      }
      this.saveBlogDialog = true
    },

    saveOk () {
      if (this.blogForm.title.trim() == '') {
        this.$message.error("没输入博客标题")
        return
      }
      this.blogForm.blogTag = this.blogForm.blogTag.join(';')


      this.$API.save(this.blogForm).then(
        res => {
          this.blogForm.blogTag = []
          if (res.data.msg_code == 1) {
            this.$message.error(res.data.msg[0])
          }
          else {
            this.$message.success("保存成功，再来一篇")
            location.reload();
          }
          this.saveBlogDialog = true
        }
      ).catch(err => {
        console.log(err)
      })

    },

    load () {

    },
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
    .saveBtn {
      display: inline-block;
      cursor: pointer;
      float: right;
    }
    &::after {
      content: "";
      clear: both;
      display: block;
    }
  }

  .content {
    height: 90%;
    background: antiquewhite;
    position: relative;
    .arrow {
      position: absolute;
      font-size: 28px;
      text-align: right;
      cursor: pointer;
      padding: 10px;
    }
    .leftStatue {
      width: 200px;
      height: 100%;
      float: left;
      background: #e8e8e8;
      font-size: 14px;
      .itemBox {
        height: 100%;
        .pageUl {
          padding: 15px 0;
          .date {
            padding: 10px;
          }
          .pageItem {
            padding: 5px;
            cursor: pointer;
            color: #827d7dc7;
            font-size: 12px;
            &:hover {
              color: #000;
            }
          }
        }
      }
    }
    .closeLeft {
      display: none;
    }

    .textEditor {
      width: calc(100% - 200px);
      float: right;
      height: 100%;
      background: #f5f4f4;
      /deep/.quill-editor {
        height: 100%;
        .ql-container {
          height: 90%;
        }
        .ql-toolbar {
          height: 10%;
        }
      }
    }
    .textEditFull {
      width: 100%;
    }
  }

  .dialog {
    .el-form-item__content {
      text-align: left;
    }
  }
}
/*修改滚动条样式*/
div::-webkit-scrollbar {
  width: 7px;
  height: 10px;
  /**/
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #fdfdfd;
  border-radius: 10px;
}
// div::-webkit-scrollbar-thumb:hover {
//   background: #333;
// }
div::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>
