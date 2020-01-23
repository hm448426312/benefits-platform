<template>
    <div class="layout-left-side">
      <div
        class="menu-list"
        :class="menuClass(item)"
        v-for="(item, index) of showMenu"
        v-bind:key="index"
        @click="goRoute(item)"
      >
        {{item.meta.title}}
      </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as globalMap from '@/global-map/index'
export default {
  name: 'LeftSide',
  data () {
    return {
      rightRouter: globalMap.rightRouter,
      showMenu: []
    }
  },
  computed: {
    ...mapGetters(['menu', 'userInfo'])
  },
  mounted () {
    let tempShowMenu = []
    this.initShowMenu(tempShowMenu, this.menu)
    this.showMenu = tempShowMenu
    tempShowMenu = null
  },
  methods: {
    goRoute (item) {
      if (item.meta.fullPath === this.$route.path) {
        return false
      }
      this.$router.push(item.meta.fullPath)
    },
    menuClass (item) {
      return {
        'active': item.meta.fullPath === this.$route.path || this.$route.path.indexOf(item.meta.fullPath) !== -1
      }
    },
    initShowMenu (target, menu = []) {
      menu.forEach(item => {
        if (item.meta && !item.meta.hide && this.hasRight(this.userInfo.type, item.meta.code)) {
          target.push(item)
        }
        if (item.children && item.children.length > 0) {
          if (!item.meta) {
            this.initShowMenu(target, item.children)
          }
        }
      })
    },
    hasRight (type = 'ADMIN', code) {
      if (this.rightRouter[type].indexOf(code) !== -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/variable-layout";
  .layout-left-side{
    width: $leftSideWidth;
    box-shadow: 2px 0px 10px 0 rgba(200,200,200,0.5);
    overflow: auto;
    flex-shrink: 0;
    flex-grow: 0;
    heigth: 60px;
    z-index: 1;
    .menu-list{
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      font-size: 16px;
      &.active{
        background-color: $menuActColor;
        color: #fff;
      }
    }
  }
</style>
