<template>
  <div id="app">
    <template>
      <router-view v-if="canload"></router-view>
    </template>
  </div>
</template>

<script>
import * as commonApi from '@/api/common/index'
export default {
  name: 'App',
  data () {
    return {
      canload: false
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      await new Promise((resolve, reject) => {
        commonApi.getUserInfo().then(res => {
          this.$store.commit('setUserInfo', res.data)
          this.$nextTick(() => {
            this.canload = true
          })
        }).finally(() => {
          resolve()
        })
      })
    }
  }
}
</script>
