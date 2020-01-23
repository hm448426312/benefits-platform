<template>
  <div class="footer-box">
    我是footer内容
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
  @import "@/styles/variable-layout";
  .footer-box{
    height: $footerHeight;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    background-color: $bgColor;
  }
</style>
