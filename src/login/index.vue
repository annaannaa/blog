<template>
  <div class="wrapper">
    <el-page-header @back="goBack">
    </el-page-header>
    <el-card class="LoginBox">
      <el-tabs type="card"
               v-model="activeTab">
        <!-- v-model="editableTabsValue"  @edit="handleTabsEdit" -->
        <el-tab-pane label="登录"
                     name="login">
          <div>
            <el-input class="input"
                      placeholder="用户名/邮箱"
                      v-model="userName"
                      clearable>
            </el-input>
            <el-input class="input"
                      type="password"
                      placeholder="密码"
                      v-model="password"
                      clearable>
            </el-input>

            <div class="link">

              <el-checkbox v-model="rememberPassword"
                           style="text-algin:left">记住密码</el-checkbox>
              <span class="forgetpassword">忘记密码</span>
              <div></div>

            </div>
            <el-button class="button"
                       @click="goLogin()"
                       type="primary">登录</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="注册"
                     name="register">
          <el-form :model="registerObj"
                   :rules="rules"
                   ref="ruleForm">
            <el-form-item prop="name">

              <el-input class="input"
                        placeholder="用户名"
                        v-model="registerObj.name"
                        clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input class="input"
                        placeholder="邮箱"
                        v-model="registerObj.email"
                        clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="phoneNum">
              <el-input class="input"
                        placeholder="手机号码"
                        v-model="registerObj.phoneNum"
                        clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="isPublic">
              <el-checkbox style="text-align:left"
                           class="input"
                           v-model="registerObj.isPublic ">信息是否公开</el-checkbox>
            </el-form-item>
            <el-form-item prop="password">
              <el-input show-password
                        class="input"
                        placeholder="密码"
                        v-model="registerObj.password"
                        clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="rePassword">
              <el-input show-password
                        class="input"
                        placeholder="确认密码"
                        v-model="registerObj.rePassword"
                        clearable>
              </el-input>
            </el-form-item>
          </el-form>
          <el-button class="button"
                     @click="goRegister('ruleForm')"
                     type="primary">注册</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import secret from '../util/secret'
import aes from '../util/aes'
import unicode from '../util/unicode+'
import { mapState, Store } from 'vuex'
export default {
  mounted () {
    // aes.enAes('1234567812345678', '1234567812345678')
    // console.log(unicode)
    // console.log(unicode.encode('12345678'))
    // console.log(unicode.decode('bdfhjlnp'))
    if (JSON.parse(window.localStorage.getItem('user'))) {
      this.userName = JSON.parse(window.localStorage.getItem('user')).userName
      this.password = JSON.parse(window.localStorage.getItem('user')).password
    }
    if (JSON.parse(window.localStorage.getItem('registerObj'))) {
      this.registerObj = JSON.parse(window.localStorage.getItem('registerObj'))
    }

  },

  data () {
    var rePasswordValidator = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerObj.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var userNameValidator = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        if (value.length >= 2 && value.length <= 10 && !(/<.*?>/.test(value))) {
          callback()
        } else {
          callback(new Error('字符的个数2~10,输入‘<’后不能输入‘>’'))
        }
      }
    }
    var phoneNumValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      userName: '',
      password: '',
      activeTab: 'login',
      registerObj: {// 注册
        name: '',
        password: '',
        email: '',
        phoneNum: '',
        isPublic: true,
        rePassword: ''
      },
      rePassword: '', // 确认密码
      rememberPassword: false, // 记住密码
      rules: {
        name: [
          { validator: userNameValidator, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 18, message: '长度在 3 到 18个字符', trigger: 'blur' }
        ],
        rePassword: [
          { validator: rePasswordValidator, trigger: 'blur' }
        ],
        phoneNum: [
          { validator: phoneNumValidator, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    goRegister (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(1)
          window.localStorage.setItem('registerObj', JSON.stringify(this.registerObj))
          this.$API.postRegister(this.registerObj).then(
            res => {

              if (res.data.msg_code == 0) {
                this.$message({
                  showClose: true,
                  message: "注册成功",
                  type: 'success'
                })
              }
              else {
                this.$message({
                  showClose: true,
                  message: res.data.msg[0],
                  type: 'error'
                })
              }
            }
          )

        } else {
          this.$message({
            showClose: true,
            message: '请检查注册信息是否输入正确',
            type: 'error'
          })
          return false
        }
      })
    },
    goLogin () {
      // console.log(secret.enCodeAes('123'))
      // console.log(secret.deCodeAes('Fyi6kiI24shuDhfyNNHl3g=='))
      if (this.rememberPassword) {
        window.localStorage.setItem('user', JSON.stringify({ userName: this.userName, password: this.password }))
      }
      this.$API.postLogin({ name: this.userName, password: this.password })
        .then(
          res => {
            if (res.data.msg_code === 1) {
              this.$message.error(res.data.msg[0])
            }
            if (res.data.msg_code === 0) {
              this.$message.success(res.data.msg[0])
              window.sessionStorage.setItem('apiToken', res.data.apitoken)
              window.sessionStorage.setItem('userId', res.data.UserId)
              this.$router.push({ name: 'home' })
              this.$store.commit('ChangeLogin', true)
            }
          }
        ).catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  padding: 5vh;
}
.LoginBox {
  width: 80vw;
  height: 80vh;
  max-width: 800px;
  // position: absolute;
  //  top: 10%;
  margin: 5vh auto;
  /deep/.el-tabs__content {
    padding: 0 5%;
    .input {
      //width: 90%;
      padding: 3vw 0;
    }
    .button {
      display: block;
      width: 100%;
      margin: 3vw auto;
    }
    .link {
      display: block;
      color: #909399;
      font-size: 14px;
      cursor: pointer;
      .el-checkbox {
        float: left;
      }
      .forgetpassword {
        float: right;
      }
    }
    .link ::after {
      content: "";
      display: block;
      clear: both;
    }
    .link:hover {
      color: #a6a9ad;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/.el-form-item__error {
      padding: 0;
    }
  }
}
</style>
