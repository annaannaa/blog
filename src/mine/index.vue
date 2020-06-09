<template>
  <div>
    <pageTop title="我的"></pageTop>
    <el-container>

      <el-main>
        <el-tabs tab-position="left"
                 class="tabs">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-position"></i> 浏览历史</span>
            <div class="infinite-list-wrapper"
                 style="overflow:auto">
              <ul class="list"
                  v-infinite-scroll="load"
                  infinite-scroll-disabled="disabled">
                <li v-for="i in count"
                    class="list-item">{{ i }}</li>
              </ul>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置管理">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import top from '../components/top'
export default {
  components: {
    pageTop: top,

  },
  data () {
    return {
      count: 10,
      loading: false,
      api_token: ''
    }
  },
  mounted () {
    if (window.sessionStorage.getItem('apiToken')) {
      this.$store.commit('ChangeLogin', true)
      this.api_token = window.sessionStorage.getItem('apiToken')
    } else {
      this.$message.error("会话过期，请重新登录")
    }
  },
  computed: {
    noMore () {
      return this.count >= 20
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    load () {
      this.loading = true
      // setTimeout(() => {
      //   this.count += 2
      //   this.loading = false
      // }, 2000)
      console.log(this.api_token)
      this.$API.getBlogHistory({ api_token: this.api_token }).then(
        res => {

        }
      ).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
}
</style>


