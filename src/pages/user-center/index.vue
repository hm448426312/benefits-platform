<template>
  <div class="base-main">
    <div class="base-title">基本信息</div>
    <div class="base-content main-content">
      <img class="user-img" alt="用户图片" src="@/assets/images/user-center/user-img-default.png">
      <div class="user-detail">
        <div
          class="user-detail-list"
          v-for="(item, index) of userDetailArr" v-bind:key="index"
        >
          <span class="user-label">{{item.label}}:</span>
            <template v-if="item.field === 'status'">
              <template v-if="userDetail[item.field] === authStatus.unAuth">
                <span class="user-value un-auth">
                  未认证
                </span>
              </template>
              <template v-else-if="userDetail[item.field] === authStatus.authIng">
                <span class="user-value auth-ing">
                  认证中
                </span>
              </template>
              <template v-else-if="userDetail[item.field] === authStatus.authError">
                <span class="user-value auth-error">
                  认证失败
                </span>
              </template>
              <template v-else>
                <span class="user-value auth-ed">
                  已认证
                </span>
              </template>
            </template>
            <template v-else>
              <span class="user-value">
                {{userDetail[item.field] || '--'}}
              </span>
            </template>
          <span class="user-action">
            <template v-if="item.field === 'status'">
              <template v-if="userDetail[item.field] === authStatus.unAuth">
                <span class="user-value un-auth">
                  <el-button @click="goRoute('/page/user-center/auth')" type="text">去认证</el-button>
                </span>
              </template>
              <template v-else-if="userDetail[item.field] === authStatus.authError">
                <span class="user-value auth-error">
                  <el-button>重新认证</el-button>
                </span>
              </template>
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as commonApi from '@/api/common/index'
import * as globalMap from '@/global-map/index'
export default {
  name: 'index',
  data () {
    return {
      authStatus: globalMap.authStatus,
      userDetail: {},
      userDetailArr: [
        {
          field: 'name',
          label: '企业名称',
          action: false
        }, {
          field: 'status',
          label: '认证状态',
          action: true
        }, {
          field: 'businessNo',
          label: '营业执照编号'
        }, {
          field: 'legal',
          label: '法人代表'
        }, {
          field: 'address',
          label: '企业地址'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.getUserDetailInfo()
  },
  methods: {
    goRoute (route) {
      this.$router.push(route)
    },
    getUserDetailInfo () {
      commonApi.getUserDetailInfo({
        userId: this.userInfo.id
      }).then(res => {
        this.userDetail = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-content{
    display: flex;
    flex-direction: row;
    .user-img{
      width: 100px;
      height: 100px;
    }
    .user-detail{
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      .user-detail-list{
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 30px;
        line-height: 30px;
        .user-label{
          width: 100px;
          color: #111;
        }
        .user-value{
          color: #666;
          &.un-auth{
          }
          &.auth-error{
            color: #F62547;
          }
          &.auth-ing{
            color: #3399FF;
          }
          &.auth-ed{
            color: #24C575;
          }
        }
        .user-action{
          margin-left: 20px;
        }
      }
    }
  }
</style>
