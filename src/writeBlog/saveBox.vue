<template>
  <div class="dialog"
       style="position:relative">

    <el-dialog title="保存博客"
               :visible="showDialog"
               :show-close="false">
      <loading1></loading1>

      <el-form :model="blogForm"
               ref="from"
               label-width="150px">
        <el-form-item label="标题">
          <el-input v-model="blogForm.title"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统类别">
          <el-select v-model="blogForm.blogType"
                     placeholder="请选择"
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
                     placeholder="请选择">
            <el-option v-for="item in blogUserTypeArray"
                       :key="item.blogTypeOnlyId"
                       :label="item.name"
                       :value="item.blogTypeOnlyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="blogTagArray"
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
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary"
                   @click="saveOk()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>

import loading1 from '../components/loading/loading'
export default {
  components: {

    loading1

  },
  mounted () {
    //初始





  },

  props: ["show", "modeOprate", "blogId", "api_token", "blogContent", "blogType", "blogUserType", "blogTag", "isPublic", "title"],
  data () {
    return {
      showDialog: this.show,
      // 弹框From
      blogForm: {
        title: this.title,
        blogType: this.blogType,
        blogContent: this.blogContent,
        blogUserType: this.blogUserType,
        blogTag: this.blogTag,
        isPublic: this.isPublic,
        api_token: this.api_token,
        blogId: this.blogId
      },

      // 系统规定的博客类型
      blogTagArray: [],
      systemBlogType: [],
      //用户自定义类别
      blogUserTypeArray: [],
      blogTagOptions: [
      ],
    }
  },

  watch: {
    show: function (newValue, oldValue) {
      this.showDialog = newValue;

    },
    api_token: function (newValue, oldValue) {
      this.blogForm.api_token = newValue;
      if (newValue != "") {
        this.getBlogType();
        this.getBlogTag();
      }

    },
    blogContent: function (newValue, oldValue) {
      this.blogForm.blogContent = newValue;

    },
    blogId: function (newValue, oldValue) {
      this.blogForm.blogId = newValue;

    },
    blogType: function (newValue, oldValue) {
      this.blogForm.blogType = newValue;


    },
    blogUserType: function (newValue, oldValue) {
      this.blogForm.blogUserType = newValue;

    },

    blogTag: function (newValue, oldValue) {
      this.blogForm.blogTag = newValue;

    },
    isPublic: function (newValue, oldValue) {
      this.blogForm.isPublic = newValue;

    },
    title: function (newValue, oldValue) {
      this.blogForm.title = newValue;

    },
  },
  methods: {
    saveOk () {
      console.log(1)
      console.log(this.blogForm)

      if (this.blogForm.title.trim() == '') {
        this.$message.error("没输入博客标题")
        return
      }
      this.blogForm.blogTag = this.blogTagArray.join(';')



      //修改
      console.log(this.blogForm)

      if (this.modeOprate == "UPDATE") {

        this.$API.changeBlog(this.blogForm).then(
          res => {
            // if (res.data.msg_code == 1) {
            //   this.$message.error(res.data.msg)

            // }
            if (res.data.msg_code == 0) {


              // this.$message.success(res.data.msg)

              this.close()
            }



          }
        ).catch(
          err => {
            console.log(err)

          }
        )
      }

      //新建
      else {
        this.$API.save(this.blogForm).then(
          res => {
            this.blogForm.blogTag = []
            if (res.data.msg_code == 1) {
              this.$message.error(res.data.msg[0])
            }
            else {

              this.$message.success("保存成功")
              this.close()
            }


          }
        ).catch(err => {
          console.log(err)

        })
      }

    },



    getBlogType () {
      if (window.localStorage.getItem('BlogType')) {
        var a = JSON.parse(window.localStorage.getItem('BlogType'))
        this.systemBlogType = a.data
        this.blogUserTypeArray = a.udata

      }
      else {
        this.$API.getBlogType({ 'api_token': this.api_token }).then(
          res => {
            this.systemBlogType = res.data.data
            this.blogUserTypeArray = res.data.udata
            window.localStorage.setItem('BlogType', JSON.stringify(res.data));

          }
        ).catch(err => {
          console.log(err)
        })
      }

    },

    //获取系统标签
    getBlogTag () {
      if (window.localStorage.getItem('BlogTag')) {
        var a = JSON.parse(window.localStorage.getItem('BlogTag'))
        this.blogTagOptions = a.data


      } else {
        this.$API.getBlogTag({ 'api_token': this.api_token }).then(
          res => {
            this.blogTagOptions = res.data.data;
          }
        ).catch(err => {
          console.log(err)
        })
      }

    },

    //关闭
    close () {

      // this.$emit("Close");
      this.$emit('update:show', false);
    }

  }



}
</script>


<style lang="less" scoped>
.dialog {
  position: relative;

  /deep/.el-dialog {
    .el-dialog__body {
      position: relative;
      padding: 0px !important;

      .el-form {
        padding: 20px;
      }
    }
  }
}
</style>