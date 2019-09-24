<template>
  <div>
    <div class="leftMenu">
      <div class="item"
           :key="item"
           v-for="item in  menuItem">
        <span> {{item.name}}</span>
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
        Image: ''
      }, {
        name: '小组',
        Image: ''
      }, {
        name: '新闻',
        Image: ''
      }, {
        name: '博问',
        Image: ''
      }, {
        name: '收藏',
        Image: ''
      }, {
        name: '文库',
        Image: ''
      }]

    }
  }

}
</script>>
<style lang="less" scoped>
.leftMenu {
  width: 100%;
  padding: 20px;
  .item {
    height: 50px;
    span {
      cursor: pointer;
    }
  }
}
</style>
