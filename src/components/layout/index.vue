<template>
    <div class="layout-box">
      <keep-alive>
        <my-header></my-header>
      </keep-alive>
      <div v-if="hasLogin" class="layout-content">
        <left-side></left-side>
        <app-main></app-main>
      </div>
      <div v-if="!hasLogin && !loading" class="layout-content">
        没有登陆
      </div>
      <div v-if="loading" class="layout-content">
        加载中
      </div>
      <keep-alive>
        <my-footer></my-footer>
      </keep-alive>
    </div>
</template>

<script>
import MyHeader from './Header'
import MyFooter from './Footer'
import LeftSide from './LeftSide'
import AppMain from './AppMain'
import {mapGetters} from 'vuex'
import * as commonApi from '@/api/common/index'
export default {
  name: 'index',
  components: {AppMain, LeftSide, MyFooter, MyHeader},
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      hasLogin: false,
      loading: true
    }
  },
  mounted () {
    this.initHasLogin()
    if (!this.hasLogin) {
      this.getUserInfo()
    }
  },
  methods: {
    async getUserInfo () {
      await new Promise((resolve, reject) => {
        commonApi.getUserInfo().then(res => {
          this.$store.commit('setUserInfo', res.data)
          this.hasLogin = true
          this.loading = false
        }).finally(() => {
          resolve()
        })
      })
    },
    initHasLogin () {
      if (this.userInfo) {
        this.hasLogin = true
        this.loading = false
      } else {
        this.hasLogin = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/variable-layout";
  .layout-box{
    display: flex;
    flex-direction: column;
    .layout-content{
      min-height: $layoutContentHeight;
      margin-top: 60px;
      display: flex;
      flex-direction: row;
      z-index: 1;
    }
  }
</style>
