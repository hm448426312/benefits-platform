<template>
  <div class="base-main">
    <div class="base-title">企业管理</div>
    <div class="base-content">
      <div class="base-action">
        <div class="base-btn">

        </div>
        <div class="base-filter">
          <el-select
            v-model="filter.selectedEnterpriseStatus"
            clearable
            placeholder="全部"
            size="small"
          >
            <el-option
              v-for="item in enterpriseStatus"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input size="small" v-model.trim="filter.name" placeholder="请输入企业名称" clearable></el-input>
          <el-button @click="getTableListData" size="small" type="default">查询</el-button>
          <el-button @click="resetTableListData" size="small" type="default">重置</el-button>
        </div>
      </div>
      <div class="base-table">
        <el-table
          ref="myTable"
          :data="tableData"
          @sort-change="sortChange"
          style="width: 100%"
          max-height="400px"
        >
          <!-- tableHeader循环外可加序号列、复选框列等 -->
<!--          <el-table-column type="selection" width="55"> </el-table-column>-->
          <template v-for="(header, index) of tableHeader">
            <el-table-column
              v-bind:key="index"
              :prop="header.field"
              :label="header.label"
              :width="header.width || ''"
              :sortable="header.sortable"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="header.field === 'action'">
                  <el-button
                    type="text"
                    @click="viewEnterpriseDetail(scope.row, scope.$index)"
                  >查看
                  </el-button>
                  <el-button
                    v-if="scope.row.status === authStatus.authIng"
                    type="text"
                    @click="reviewEnterpriseDetail(scope.row, scope.$index)"
                  >审核
                  </el-button>
                </template>
                <template v-else>
                  <span>{{scope.row[header.field] || '--'}}</span>
                </template>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
      <div class="base-pagination">
        <el-pagination
          size="small"
          v-if="page.total && page.total > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="page.total"
        >
        </el-pagination>
      </div>
    </div>
    <enterprise-review
      v-if="reviewObj.showReviewDialog"
      @save-event="reviewEnterpriseDetailCallBak"
      @cancel-event="reviewObj.showReviewDialog = false"
    ></enterprise-review>
  </div>
</template>

<script>
import * as getEnterpriseList from '@/api/enterprise/index'
import * as globalMap from '@/global-map/index'
import EnterpriseReview from './enterprise-review'

export default {
  name: 'index',
  components: {EnterpriseReview},
  data () {
    return {
      authStatus: globalMap.authStatus,
      reviewObj: {
        showReviewDialog: false,
        enterprise: null,
        index: -1
      },
      // 企业状态
      enterpriseStatus: [
        {
          name: '未认证',
          value: globalMap.authStatus.unAuth
        }, {
          name: '认证中',
          value: globalMap.authStatus.authIng
        }, {
          name: '认证失败',
          value: globalMap.authStatus.authError
        }, {
          name: '已认证',
          value: globalMap.authStatus.authEd
        }
      ],
      // 分页参数
      page: {
        pageSizes: [2, 20, 30, 50],
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      // 过滤参数
      filter: {
        selectedEnterpriseStatus: '',
        name: ''
      },
      // 排序参数
      sort: {
        sort: '',
        order: ''
      },
      // 其他业务参数
      selfParams: {
      },
      // 表格数据
      tableData: [],
      // 表格表头数据
      tableHeader: [
        {
          field: 'name', // 列key
          label: '企业名称', // 列头显示文本
          sortable: 'custom' // 排序
        },
        {
          field: 'tel',
          label: '联系电话'
        },
        {
          field: 'legal',
          label: '法人'
        },
        {
          field: 'address',
          label: '企业地址'
        },
        {
          field: 'businessNo',
          label: '营业执照编号'
        },
        {
          field: 'status',
          label: '状态'
        },
        {
          field: 'action',
          label: '操作',
          width: '150px' // 操作列一般固定宽度
        }
      ]
    }
  },
  mounted () {
    this.initPage()
    this.initFilter()
    this.initSort()
    this.getTableListData()
  },
  methods: {
    initReviewDialogData () {
      this.reviewForm.status = 'pass'
      this.reviewForm.desc = 'pass'
    },
    reviewEnterpriseDetailCallBak (reviewResult) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.updateEnterprise(reviewResult)
      this.reviewObj.showReviewDialog = false
    },
    updateEnterprise (reviewResult) {
      this.reviewObj.enterprise.status = reviewResult.status === 'pass' ? 'auth-ed' : 'auth-error'
    },
    reviewEnterpriseDetail (enterprise, index) {
      this.reviewObj.enterprise = enterprise
      this.reviewObj.index = index
      this.reviewObj.showReviewDialog = true
    },
    viewEnterpriseDetail (enterprise, index) {
      this.$router.push({
        path: '/page/enterprise-manage/review',
        query: {
          id: enterprise.id
        }
      })
    },
    // 初始化过滤参数
    initFilter () {
      this.filter.name = ''
      this.filter.selectedEnterpriseStatus = ''
    },
    // 初始化分页参数
    initPage () {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.page.total = 0
    },
    // 初始化排序参数
    initSort () {
      this.sort = {
        sort: '',
        order: ''
      }
    },
    handleSizeChange (size) {
      this.page.currentPage = 1
      this.page.pageSize = size
      // 获取数据
      this.getTableListData()
    },
    handleCurrentPageChange (page) {
      this.page.currentPage = page
      // 获取数据
      this.getTableListData()
    },
    // 排序改变事件
    sortChange ({column, prop, order}) {
      // order=descending 降序 DESC
      // order=ascending 升序 DESC
      if (order) {
        this.sort.sort = prop
        this.sort.order = order === 'descending' ? 'DESC' : 'ASC'
      } else {
        this.sort.sort = ''
        this.sort.order = ''
      }
    },
    // 组合参数
    groupParams () {
      return Object.assign({}, this.page, this.sort, this.filter, this.selfParams)
    },
    // 重置
    resetTableListData () {
      this.initPage()
      this.initFilter()
      this.initSort()
      this.$refs.myTable.clearSort()
      this.getTableListData()
    },
    // 获取数据
    getTableListData () {
      const params = this.groupParams()
      getEnterpriseList.getEnterpriseList(params).then(res => {
        this.tableData = res.data
        this.page.total = this.tableData.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
