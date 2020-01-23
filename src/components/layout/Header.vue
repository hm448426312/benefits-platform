<template>
    <div class="header-box">
      <div class="cursor-p" @click="goRoute('/home')">LOGO 点击去首页</div>
      <div class="cursor-p" @click="goRoute('/page/user-center')">姓名 点击去个人中心</div>
    </div>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    goRoute (route) {
      this.$router.push(route)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/variable-layout";
  .header-box{
    height: $headerHeight;
    background-color: $headerBgColor;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
  }
</style>
