
<template>
  <div class="sync-loding"
       v-show="loading">
    <div class="ldbox">
      <i class="loading el-icon-loading"></i>
      <span class="text">加载中...</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed:
    mapState({
      loading: state => state.loading.status
    })
  ,
  mounted () {

  }
}
</script>
 
<style lang="less" rel="stylesheet/less">
.sync-loding {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  background: #fffdfd94;
  .ldbox {
    position: absolute;
    left: calc(50% - 95px);
    top: calc(50% - 30px);
    height: 60px;
    width: 190px;
    line-height: 60px;

    .loading {
      color: #409eff;
      font-size: 60px;
    }

    .text {
      vertical-align: top;
      font-size: 30px;
    }
  }
}
</style>
