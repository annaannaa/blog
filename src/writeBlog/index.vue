<template>
  <div class="wrapper">
    <div>
      <pageTop title="写博"
               :loginSate="loginSate"></pageTop>
      <div class="saveBtn"
           style="position:absolute;top:20px;right:100px"
           @click="add">新建
        <i class="el-icon-plus"></i>
      </div>
      <div class="saveBtn"
           style="position:absolute;top:20px;right:20px"
           @click="save">保存
        <i class="el-icon-finished"></i>
      </div>
    </div>
    <!-- <span>arrow 返回上一页</span>
      <span>your Name</span> -->

    <div class="content">
      <div class="arrow "
           @click="openLeftBox=!openLeftBox">
        <i :class="[{'el-icon-arrow-left':openLeftBox},{'el-icon-arrow-right':!openLeftBox}]"></i>
      </div>

      <div v-if="openLeftBox"
           class="leftStatue">
        <!-- <loading></loading> -->
        <div class="itemBox infinite-list"
             v-infinite-scroll="load"
             style="overflow:auto">

          <ul class="pageUl">
            <li v-for="item in myBlogList"
                :key="item.id"
                class="pageLi">

              <i class="el-icon-date">{{item.updated_at}}</i>

              <!-- <router-link :to="{name:'writeBlog',query:{'blogId':item.blogOnlyId}}"> -->
              <div class="pageItem"
                   @click="getBlog(item.blogOnlyId)"> {{item.blogTitle}}</div>
              <!-- </router-link> -->
              <!-- <div v-html="item.blogContent"></div> -->

              <!-- <li class="pageItem"
                v-for="item in itemDate.page"
                :key="item.index">
              {{item.name}}
            </li> -->
            </li>
          </ul>
        </div>
      </div>
      <div class="textEditor"
           :class="{textEditFull:!openLeftBox}">
        <loading></loading>
        <quill-editor class="editor"
                      ref="myTextEditor"
                      :options="options"
                      @change="onEditorChange($event)"
                      v-model="blogContent">
        </quill-editor>

      </div>
    </div>
    <!-- 弹出层 -->
    <save-box :show.sync="saveBlogDialog"
              :modeOprate='mode'
              :blogId='blogId'
              :api_token="api_token"
              :blogContent="blogContent"
              :blogType="blogType"
              :blogUserType="blogUserType"
              :blogTag="blogTagArray"
              :isPublic="isPublic"
              :title="title"></save-box>
    <!-- 真实上传图片按钮 -->
    <div style="display:none">
      <el-upload class="upload"
                 action=""
                 :http-request="upload"
                 multiple
                 :before-upload="beforeUpload"
                 :file-list="
                 fileList">
        <el-button size="small"
                   type="primary">点击上传</el-button>
        <div slot="tip"
             class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import top from '../components/top'
import loading from '../components/loading/loading'
import saveBox from './saveBox'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image'],
  ['clean']

]
export default {
  components: {
    pageTop: top,
    loading,
    saveBox
  },
  mounted () {


    // 获取系统博客类型
    if (window.sessionStorage.getItem('apiToken')) {
      this.api_token = window.sessionStorage.getItem('apiToken')
    }


    this.getBlogList();

    if (this.$route.query.hasOwnProperty('blogId')) {
      this.getBlog(this.$route.query.blogId);
    }

    //登录状态
    if (window.localStorage.getItem('user')) {

      this.loginSate = true;
    }
  },

  data () {
    return {
      content: '',
      // 左边文章栏开关
      openLeftBox: true,
      loginSate: false,
      api_token: '',
      saveBlogDialog: false,
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
      //博客标签
      blogTag: [],

      //上传图片列表
      fileList: [],
      //我的博客列表
      myBlogList: [],
      //option
      options: {
        placeholder: '请输入......',
        readOnly: false,
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (value) {
                if (value) {
                  console.log(value)
                  // 触发input框选择图片文件
                  document.querySelector('.upload input').click()

                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      blogId: "",
      mode: "ADD",
      blogContent: '',

      title: '',
      blogType: '',
      blogContent: '',
      blogUserType: '',
      blogTagArray: [],
      isPublic: true,
      api_token: ''
      ,

    }
  },


  methods: {
    //处理富文本图片问题
    onEditorChange ({ editor, html, text }) {
      //any  
      console.log(editor, html, text);
    },

    //beforeUpload
    beforeUpload (file) {
      // console.log(file)
    },

    upload (e) {
      //10.20.36.74:8000/api/blog/ImgUp
      let files = e.file;
      let img = new FormData();
      img.append('file', files)
      this.$API.uploadImage(img, this.api_token).then(
        res => {
          if (res.data.msg_code == 0) {
            console.log(res.data.path)
            this.blogContent += `<img src= "http://${res.data.path}"  alt='' >`
          } else {
            this.$message.error(res.data.msg)
            this.blogContent += "<el-image></el-image>"
          }
        }
      ).catch(err => {
        console.log(err)
      })
    },

    save () {
      if (!this.loginSate) {
        this.$message.error(
          "您还没登录呢"
        )
        return
      }
      if (this.blogContent.trim() == "") {
        this.$message.error(
          "您没有输入内容"
        )
        return
      }
      this.saveBlogDialog = true
    },


    add () {
      this.blogContent = ""
    },
    getBlogList () {
      this.$API.getMyBlogList({        index: 1,
        pagecount: 10,
        blogtypeId: '',
        type: 1,
        isGood: 0,
        api_token: this.api_token
      }).then(
        res => {
          this.myBlogList = res.data.data;

        }
      ).catch(err => {
        console.log(err)
      })
    },
    getBlog (blogId) {
      console.log(blogId)
      this.$API.getBlogInfo({ api_token: this.api_token, blogId: blogId }).then(
        res => {
          console.log(res)
          this.blogContent = res.data.data1.blogContent
          this.title = res.data.data1.blogTitle
          this.blogType = res.data.data1.blogTypeId
          this.blogUserType = res.data.data1.blogUserTypeId
          this.blogTag = res.data.data1.blogTag.split(";")
          this.blogTagArray = res.data.data1.blogTag
          this.mode = "UPDATE"
          this.blogId = res.data.data1.blogOnlyId
          this.blogContent = res.data.data1.blogContent
        }
      ).catch(
        res => {
          console.log(res)
        }
      )

    },
    load () {

    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    // //关闭弹框
    // CloseDialog () {
    //   console.log(2)
    //   this.saveBlogDialog = false;
    // }



  }
}
</script>

<style lang="less" scoped>
.wrapper {
  top: 10px;
  height: 100%;

  .saveBtn {
    display: inline-block;
    cursor: pointer;
    float: right;
    &:hover {
      background: #ecf5ff;
    }
  }

  .content {
    height: 95%;
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
      position: relative;
      .itemBox {
        height: 100%;
        .pageUl {
          padding-top: 50px;
          .pageLi {
            padding: 10px 5px;
            /deep/ .el-icon-date {
              color: #409eff;
            }
            .pageItem {
              text-align: left;
              padding: 10px;
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
