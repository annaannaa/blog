<template>
  <div class="loginBox">
    <div class="logo">logo</div>
    <div class="content">

      <div class="loginBtnBox">
        <div v-if="!loginSate"
             style="float:left">
          <i class="el-icon-s-custom"></i>
          <router-link to="/login">
            <span>登陆</span>
          </router-link>
        </div>
        <div v-else
             style="float:left">
          <img src=""
               alt="" />
          <span>{{name}}</span>
          <i class="el-icon-switch-button"></i>
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

    </div>
    <!-- 设置菜单下的弹框 -->

    <el-dialog title="收货地址"
               :visible.sync="dialogChangeTheme">
      <!-- <el-form :model="form">
        <el-form-item label="活动名称"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域"
                      :label-width="formLabelWidth">
          <el-select v-model="form.region"
                     placeholder="请选择活动区域">
            <el-option label="区域一"
                       value="shanghai"></el-option>
            <el-option label="区域二"
                       value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      name: '张三',
      // 弹框 -------------------
      // 更换主题弹框
      dialogChangeTheme: false

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
</style>
