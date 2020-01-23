<template>
    <div class="layout-box">
      <keep-alive>
        <my-header></my-header>
      </keep-alive>
      <div class="layout-content">
        <left-side></left-side>
        <app-main></app-main>
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
export default {
  name: 'index',
  components: {AppMain, LeftSide, MyFooter, MyHeader}
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
