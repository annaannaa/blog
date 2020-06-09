<template>
  <div class="wrapper">
    <div class="loginBox">
      <div class="logo">logo</div>
      <div class="content">

        <div class="loginBtnBox">
          <div v-if="!loginSate"
               style="float:left">
            <i class="el-icon-s-custom"></i>
            <router-link to="/login">
              <span>登录</span>
            </router-link>
          </div>
          <div v-else
               style="float:left">
            <!-- <img src=""
               alt="" />
          <span>{{name}}</span> -->
            注销
            <i class="el-icon-switch-button"
               @click="Logout"></i>
          </div>
          <div style="float:right;cursor:pointer">
            <!-- <i class="el-icon-s-tools"></i>
          <span>设置</span> -->
            <el-dropdown>
              <i class="el-icon-s-tools"></i>
              <span>设置</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="dialogChangeTheme=ture">更改主题</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </div>
        <div>
          <span>更改主题</span>
          <el-switch v-model="themeMode"
                     @change="changeTheme"
                     active-color="#409EFF"
                     inactive-color="#0f3d6c">

          </el-switch>
        </div>
      </div>

    </div>

    <!-- 换肤 -->

    <div class="imageBox">
      <el-carousel>
        <el-carousel-item v-for="item in imageData"
                          :key="item.id">
          <img :src="item.src"
               alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import con1 from "@/assets/images/topSample4.jpg";
import con2 from "@/assets/images/1.jpg";
import con3 from "@/assets/images/topSample1.jpg";
export default {
  name: 'login',
  data () {
    return {
      name: '张三',

      loginSate: false,
      // 弹框 -------------------
      // 更换主题弹框
      dialogChangeTheme: false,
      //主题模式
      themeMode: true,
      imageData: [
        { src: con1, id: 0 },
        { src: con2, id: 1 },
        { src: con3, id: 2 }
      ]

    }
  },

  mounted () {
    if (window.localStorage.getItem('user')) {

      this.name = JSON.parse(window.localStorage.getItem('user')).userName
      this.loginSate = true;
    }
  },
  methods: {
    changeTheme () {
      console.log(this.themeMode)
      if (this.themeMode == false) {
        document.getElementsByTagName('body')[0].className = 'nightTheme';
      }
      else {
        document.getElementsByTagName('body')[0].className = '';
      }
    },

    //清空缓存
    Logout () {
      //
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;

  .loginBox {
    width: 200px;
    float: left;
    height: 100%;
    .logo {
      font-size: 50px;
      padding: 10px;
    }
    .loginBtnBox {
      min-width: 150px;
      width: 150px;
      margin: 0 auto;
      &::after {
        display: block;
        content: "";
        clear: both;
      }
    }
  }
  .imageBox {
    width: calc(100% - 200px);
    height: 100%;
    float: left;
    /deep/.el-carousel {
      height: 100%;
      .el-carousel__container {
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
