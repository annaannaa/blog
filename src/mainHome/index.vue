<template>
  <!-- <div class="wrapper">
    <div class="leftMenu">
      <login></login>
      <leftMenu></leftMenu>
    </div>
   
    <div class="rightContent"
         id="rightContent">
      <div class="top"></div>
    </div>

    
    <blogList></blogList>
  </div> -->
  <el-container>
    <el-header>
      <login></login>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <leftMenu :menuItem="menuItem"></leftMenu>
      </el-aside>
      <el-main>
        <blogList></blogList>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import leftMenu from '../components/leftMenu'
import login from './login.vue'
import blogList from './blogList.vue'
export default {
  name: 'mainHome',
  components: {
    leftMenu,
    login,
    blogList
  },
  mounted () {
    // console.log(this.$router)
  },
  data () {    return {

      menuItem: [{
        name: '主页',
        link: '/home',
        Image: 'el-icon-s-home',
        index: 1
      },
      {
        name: '写博',
        link: '/writeBlog',
        Image: 'el-icon-edit',
        index: 2
      }, {
        name: '查博',
        link: '/searchBlog',
        Image: 'el-icon-search',
        index: 3
      }, {
        name: '收藏',
        link: '/writeBlog',
        Image: 'el-icon-star-off',
        index: 4
      }, {
        name: '我的',
        link: '/mine',
        Image: 'el-icon-user',
        index: 5
      }]

    }  }
}
</script>
<style lang="less" scoped>
.el-container {
  .el-header {
    height: 200px !important;
  }
  .el-container {
    .el-aside {
    }
    .el-main {
      min-width: 1200px;
    }
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
