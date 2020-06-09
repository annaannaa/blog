<template>

  <div class="wrapper">
    <loading></loading>
    <el-scrollbar style="height:100%">
      <div class="top">
        <div>
          <div style="width: 200px;float:left">
            <el-page-header class="returnBtn"
                            @back="goBack">
            </el-page-header>
            <span>博客详情</span>
          </div>
          <el-alert v-if="!loginSate"
                    style="position:absolute;top:0;left:200px;width: 80%;"
                    title="还没有登录 将无法保存"
                    type="warning">
          </el-alert>

        </div>
      </div>

      <div class="blogBox">
        <div class="blog">
          <div class="title">{{title}}</div>
          <div class="content"
               v-html="content"></div>
        </div>

        <div class="blogInfo">
          <div class="userImage">
            <router-link to="{name:user}">
              <el-avatar class="image"
                         src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </router-link>
            {{ this.blog.name}}
          </div>
          <div class="date">
            <i class="el-icon-date"></i>
            {{blog.created_at}}
          </div>
          <div>博客系统分类: {{systemBlogTypeName}}</div>
          <div>博客标签:
            <el-tag v-for="t in  blogTag">{{t}}</el-tag>
          </div>
        </div>

      </div>

      <div class="commentBox">
        <!-- 评论 -->
        <div class="comment"
             style="position: relative;">
          <el-input type="textarea"
                    style="display:inline-block;width:80%"
                    placeholder="想对作者说什么"
                    v-model="comment"
                    maxlength="100"
                    show-word-limit>
          </el-input>
          <el-button style="height: 40px;position: absolute;top:50%;margin-top:-20px;"
                     @click="sendComment">发送</el-button>
        </div>

        <!-- 评论列表 -->
        <div class="commentList">
          <ul>
            <li v-for="item in commentList"
                :key="item.id">
              <div class="header">
                <span class="headerImage">
                  <i class="el-icon-s-custom"></i>

                </span>
                <span class="name"
                      :title="item.name"> {{item.name}}</span>
              </div>
              <div class="body">
                <div class="word">
                  {{item.content}}
                </div>
                <div class="other">
                  <div class="left">
                    <span class="time">{{item.created_at}}</span>
                  </div>
                  <div class="right">
                    <div class="like">
                      <span :class="{isActive:item.IsLiked,thumb:true}"
                            @click="handleThumb(item)"><i class="fa fa-thumbs-o-up"
                           aria-hidden="true"></i>
                      </span>
                      <span>
                        {{item.likeNum}}
                      </span>
                    </div>
                    <i class="el-icon-close delComment"
                       @click="delComment(item.commentOnlyId)"></i>
                    <!-- <div class="noLike">
                      <span :class="{isActive:item.nolike,thumb:true}"
                            :data="item.id"
                            @click="handleThumb(item,0)"><i class="fa fa-thumbs-o-down"
                           aria-hidden="true"></i>
                      </span>
                      <span>
                        {{item.noLikeNum}}
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <template>
        <el-backtop target=".el-scrollbar .el-scrollbar__wrap"></el-backtop>
      </template>
    </el-scrollbar>
  </div>

</template>


<script>
import loading from '../components/loading/loading'
import { mapState } from 'vuex'
export default {
  name: "blogInfo",
  components: {
    loading
  },
  data () {
    return {
      loginSate: false,
      api_token: '',
      blogId: '',
      title: '',
      content: '',
      Bloguser_id: '',
      blogTag: [],
      blog: {},
      systemBlogType: [],
      systemBlogTypeName: "",
      isActive: false,
      //评论
      comment: '',
      commentList: [],

    }
  },
  mounted () {

    //读seesionStorage
    this.blogId = this.$route.query.blogId
    if (window.sessionStorage.getItem('apiToken')) {
      this.loginSate = true
      this.api_token = window.sessionStorage.getItem('apiToken')
    }
    if (window.sessionStorage.getItem('systemBlogType')) {
      this.systemBlogType = JSON.parse(window.sessionStorage.getItem('systemBlogType'))
    }

    this.reflushBlog();




  },
  methods: {
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    sendComment () {
      var object = {
        api_token: this.api_token,
        blogOnlyId: this.blogId,
        comment: this.comment
      }
      this.$API.addComment(object).then(
        res => {

          this.reflushBlog();
        }
      ).catch(err => {

      })


    },

    //删除评论
    delComment (commentOnlyId, user_id) {
      var object = {
        commentOnlyId: commentOnlyId,
        blogOnlyId: this.blogId,
        api_token: this.api_token,
        user_id: this.Bloguser_id
      }
      console.log(object)
      this.$API.delComment(object).then(
        res => {


          this.reflushBlog();
        }
      ).catch(err => {

      })
    },

    reflushBlog () {
      //获取博客信息
      this.$API.getBlogInfo({ blogId: this.blogId, api_token: this.api_token }).then(
        res => {

          this.title = res.data.data1.blogTitle;
          this.content = res.data.data1.blogContent;
          console.log("content", this.content)
          this.blog = res.data.data1;
          // res.data.data2.forEach(e => { e.like = false; e.nolike = false; })
          this.commentList = res.data.data2;

          this.systemBlogType.forEach(Element => {

            if (Element.blogTypeOnlyId == this.blog.blogTypeId) {
              this.systemBlogTypeName = Element.name

            }
          })
          this.blogTag = this.blog.blogTag.split(";")
          this.Bloguser_id = res.data.data1.user_id
        }
      ).catch(err => {

      })
    },
    handleThumb (item) {
      // item.IsLiked = !item.IsLiked


      var object = {
        api_token: this.api_token,
        commentOnlyId: item.commentOnlyId,
        IsLike: 1
      }
      this.$API.LikeOnLike(object).then(
        res => {
          console.log(res)
          if (res.data.msg_code == 0) {
            this.reflushBlog()
          }

        }

      ).catch(err => {

      })
    }
  }

}
</script>


<style lang="less" scoped>
.wrapper {
  top: 10px;
  height: 100%;
  // overflow-y: scroll;
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

    &::after {
      content: "";
      clear: both;
      display: block;
    }
  }
  .blogBox {
    padding: 0 10%;
    .blog {
      float: left;
      width: 78%;
      // border: 1px solid #909399;
      .title {
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        // text-align: left;
        font-weight: 700;
      }
      .content {
        text-align: left;
        //   width: 80%;
      }
      &::after {
        display: block;
        clear: both;
        content: "";
      }
    }
    .blogInfo {
      float: right;
      width: 18%;
      height: auto;
      // border: 1px solid #000;
      .userImage .image {
        cursor: pointer;
      }
      div {
        padding: 5px 0;
      }
      &::after {
        display: block;
        clear: both;
        content: "";
      }
    }
    &::after {
      display: block;
      clear: both;
      content: "";
    }
  }
  .commentBox {
    width: 80%;
    .comment {
      width: 100%;
      i {
        text-align: left;
      }
      .el-textarea {
        padding: 20px 50px;
      }
    }
    .commentList {
      //padding: 40px 0;
      //padding-left: 60px;
      // text-align: left;
      ul {
        padding: 0 50px;
        text-align: left;
        // min-width: 970px;
        /* vertical-align: bottom; */
        display: inline-block;
        width: 80%;
        li {
          padding: 20px 0;
          .header {
            display: inline-block;
            width: 60px;

            vertical-align: bottom;

            span.headerImage {
              border: 1px solid #eee;
              position: relative;
              display: inline-block;
              height: 30px;
              width: 30px;
              border-radius: 50% 50%;
              text-align: center;
              vertical-align: middle;

              i {
                // position: absolute;
              }
              &::after {
                display: block;
                content: "";
                clear: both;
              }
            }
            span.name {
              color: #606266;
              width: 60px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: block;
            }
          }
          .body {
            display: inline-block;
            width: 90%;
            //  padding: 0 30px;
            text-align: left;
            .word {
              //  display: inline-block;
            }
            .other {
              // padding-left: 30px;
              .left {
                float: left;
                span.time {
                  color: #606266;
                }
              }
              .right {
                float: right;
                .noLike {
                  display: inline-block;
                  padding: 0 5px;
                }
                .like {
                  display: inline-block;
                  padding: 0 5px;
                }
                .delComment {
                  cursor: pointer;
                  &:hover {
                    color: #409eff;
                  }
                }
                span.thumb {
                  cursor: pointer;
                }
                span.isActive {
                  i {
                    color: #409eff;
                  }
                }
              }
              &::after {
                display: block;
                content: "";
                clear: both;
              }
            }
          }
        }
      }
    }
  }
}
/deep/.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style> 

