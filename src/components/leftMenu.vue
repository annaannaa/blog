<template>
  <div>
    <div class="wrapper">
      <!-- <div class="item"
           :key="item.index"
           v-for="item in  menuItem">
        <router-link :to="item.link"
                     class="titleItem">
          <span> {{item.name}}</span>
          <i :class="item.Image"></i>
        </router-link>
      </div> -->
      <el-menu default-active="2"
               class="el-menu-vertical-demo item">

        <el-menu-item :index="item.index"
                      :key="item.index"
                      v-for="item in  menuItem1">

          <router-link :to="item.link"
                       class="titleItem">
            <i :class="item.Image"></i>
            <span>{{item.name}}</span>
          </router-link>
        </el-menu-item>

      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'leftMenu',
  props: ["menuItem"],
  data: function () {
    return {
      menuItem1: this.menuItem

    }
  }

}
</script>>
<style lang="less" scoped>
.wrapper {
  .item {
    height: 50px;
    .titleItem {
      text-decoration: none;
      display: block;
      color: #000;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
