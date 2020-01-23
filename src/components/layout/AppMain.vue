<template>
    <div class="app-main">
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style lang="scss" scoped>
  @import "@/styles/variable-layout";
  .app-main{
    flex: 1;
    margin: 10px 20px;
    display: flex;
    flex-direction: column;
  }
</style>
