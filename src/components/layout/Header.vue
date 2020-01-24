<template>
    <div class="header-box">
      <div class="cursor-p header-left" @click="goRoute('/home')">LOGO 点击去首页</div>
      <div v-if="userInfo" class="header-right cursor-p">
        <el-dropdown @command="handleCommand" size="small" trigger="click">
          <span class="el-dropdown-link">
            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/page/user-center">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-else class="header-right">
        <el-button type="text">登录</el-button>
        <el-button type="text">注册</el-button>
      </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        console.log('注销')
      } else {
        this.goRoute(command)
      }
    },
    goRoute (route) {
      if (this.$route.path === route) {
        return false
      }
      this.$router.push(route)
    },
    logout () {}
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
    .header-right{
      margin-right: 20px;
      .el-dropdown{
        color: #fff;
      }
      .el-button--text{
        color: #fff;
      }
    }
  }
</style>
