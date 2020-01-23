<template>
  <div>
    <keep-alive>
      <my-header></my-header>
    </keep-alive>
    <div class="home-content">
      我是首页
    </div>
    <keep-alive>
      <my-footer></my-footer>
    </keep-alive>
  </div>
</template>

<script>
import MyHeader from '@/components/layout/Header'
import MyFooter from '@/components/layout/Footer'
export default {
  name: 'Index',
  components: {MyFooter, MyHeader}
}
</script>

<style lang="scss" scoped>
  @import "@/styles/variable-layout";
  .home-content{
    min-height: 400px;
    height: $layoutContentHeight;
  }
</style>
