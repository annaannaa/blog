<template>
  <div class="loginBox">
    <div class="logo">logo</div>
    <div class="content">
      <!-- 头像 -->
      <img src=""
           alt="">
      <span>{{name}}</span>
      <span>{{state}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      name: '张三'

    }
  },
  computed: {
    state: {
      get () {
        if (state == false) {
          state = "未登陆"
        }
        if(state == true)
        {
          state = this.name;
        }
      } 
    }
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
