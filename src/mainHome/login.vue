<template>
  <div class="loginBox">
    <div class="logo">logo</div>
    <div class="content">
      <span v-if="loginSate">
        <img src=""
             alt="" />
        <span>{{name}}</span>
        <i class="el-icon-switch-button"></i>
      </span>
      <div v-if="!loginSate">
        <i class="el-icon-s-custom"></i>
        <router-link to="/login">
          <span>登陆</span>
        </router-link>

      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      name: '张三'

    }
  },
  computed: {
    ...mapState({
      loginSate: 'loginSate'
    })
  }
}
</script>>

<style lang="less" scoped>
.loginBox {
  width: 100%;
  height: 30vh;
  .logo {
    font-size: 50px;
    padding: 10px;
  }
}
</style>
