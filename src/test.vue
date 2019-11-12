<template>
  <!-- <div> -->
  <!-- <div v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="10">
      <div v-for="item in data"
           :key="item.index">{{item.name}}</div>

    </div> -->
  <div>
    <ul class="infinite-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="busy"
        style="overflow:auto;height:500px">
      <li v-for="i in data"
          class="infinite-list-item">{{ i.name }}</li>
    </ul>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data () {
    return {
      count: 0,
      data: [],
      busy: false
    }
  },
  methods: {
    loadMore: function () {
      this.busy = true
      setTimeout(() => {
        for (var i = 0, j = 10; i < j; i++) {
          this.data.push({ name: this.count++ })
        }
        console.log(this.data)
        this.busy = false
      }, 1000)
    }
  }
}
</script>
