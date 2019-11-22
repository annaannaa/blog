<template>
  <div class="wrapper">
    <div class="top">
      <div>
        <el-page-header class="returnBtn"
                        @back="goBack">
        </el-page-header>
        <div class="saveBtn"
             @click="saveBlogDialog=true">保存
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
                      v-model="content">
        </quill-editor>

      </div>
    </div>
    <!-- 弹出层 -->
    <div class="dialog">
      <el-dialog title="博客"
                 :visible.sync="saveBlogDialog">
        <el-form :model="blogForm">
          <el-form-item label="标题">
            <el-input v-model="blogForm.blogTitle"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="系统类别">
            <el-select v-model="blogForm.blogType"
                       placeholder="请选择活动区域">
              <el-option v-for="item in systemBlogType"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>

export default {
  mounted () {
    // 获取系统博客类型
    var token = window.localStorage.getItem('apiToken')
    console.log(token)
    this.$API.getBlogType({ 'api_token': token }).then(
      res => {
        console.log(res)
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
      // 保存博客
      // 弹框显示
      saveBlogDialog: false,
      // 弹框From
      blogForm: {
        blogTitle: '',
        blogType: ''
      }

    }
  },
  methods: {
    // toggleShow () {
    //   if (this.closeLeft === false) {
    //     this.closeLeft = true
    //     this.openLeft = false
    //   } else if (this.closeLeft === true) {
    //     this.closeLeft = false
    //     this.openLeft = true
    //   }
    // }
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
