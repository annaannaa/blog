<template>
  <div>
    <div class="wrapper">
      <div class="item"
           :key="item.index"
           v-for="item in  menuItem">
        <router-link :to="item.link"
                     class="titleItem">
          <span> {{item.name}}</span>
          <i :class="item.Image"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'leftMenu',
  data: function () {
    return {
      menuItem: [{
        name: '写博',
        link: '/writeBlog',
        Image: 'el-icon-edit',
        index: 1
      }, {
        name: '查博',
        link: '/searchBlog',
        Image: 'el-icon-search',
        index: 2
      }, {
        name: '新闻',
        link: '/writeBlog',
        Image: '',
        index: 3
      }, {
        name: '博问',
        link: '/writeBlog',
        Image: '',
        index: 4
      }, {
        name: '收藏',
        link: '/writeBlog',
        Image: '',
        index: 5
      }, {
        name: '文库',
        link: '/writeBlog',
        Image: '',
        index: 6
      }]

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
      color: #000;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
