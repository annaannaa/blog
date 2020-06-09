<template>
  <div class="top">
    <div style="float:left">
      <el-page-header class="returnBtn"
                      @back="goBack">
      </el-page-header>
      <span>{{title}}</span>
    </div>
    <!-- <el-alert v-if="!loginSate"
              style="position:absolute;top:0;left:200px;width: 80%;"
              title="还没有登录 将无法保存"
              type="warning">
    </el-alert> -->
  </div>
</template>

<script>
export default {
  name: "pageTop",
  props: ['title',],
  data () {
    return {

    }
  },
  mount () {

  },
  methods: {
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
  }
}
</script>

<style lang="less" scoped>
.top {
  height: 5%;
  background: #fff;
  box-sizing: border-box;
  padding: 20px 30px;
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
</style>