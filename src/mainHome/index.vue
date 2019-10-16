<template>
  <div>
    <div class="leftMenu">
      <login></login>
      <leftMenu></leftMenu>
      <i class="el-icon-edit"></i>
    </div>
    <!-- 手机端菜单  默认显示为电脑端-->
    <div class="bottomMenu">
      <bottomMenu></bottomMenu>
    </div>
    <div class="rightContent">
      <div class="top"></div>
    </div>
  </div>
</template>

<script>
import leftMenu from './leftMenu.vue'
import login from './login.vue'
export default {
  name: 'mainHome',
  components: {
    leftMenu,
    login
  },
  mounted () {
    console.log(this.$router)
  }
}
</script>
<style lang="less" scoped>
.leftMenu {
  float: left;
  width: 20%;
}
.bottomMenu {
  display: none;
}
.rightContent {
  width: 70%;
  float: right;
  height: auto;
  border: 1px solid #000;
  overflow: hidden;
  .top {
    width: 100%;
    height: 20vh;
    background-image: url("~@/assets/images/topSample2.jpg");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 0 0 10% 10%;
  }
}

@media screen and (max-width: 500px) {
  .rightContent {
    width: 100%;
  }
  .leftMenu {
    display: none;
  }
  .bottomMenu {
    display: block;
  }
}
</style>
