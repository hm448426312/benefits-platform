<template>
  <div class="base-main">
    <div class="base-title">发票地址管理</div>
    <div class="base-content">
      <div class="base-action">
        <div class="base-btn">
        </div>
        <div class="base-filter">
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
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <template v-for="(header, index) of tableHeader">
            <el-table-column
              v-bind:key="index"
              :prop="header.field"
              :label="header.label"
              :align="header.align || ''"
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
    <!--<operation-good
      v-if="showOperationDialog"
      :good-data="selectedGood"
      @save-event="operationGoodCallBak"
      @cancel-event="showOperationDialog = false"
    >
    </operation-good>-->
  </div>
</template>

<script>
import * as invoiceApi from '@/api/invoice/index'

export default {
  name: 'index',
  data () {
    return {
      selectedOrder: null,
      showOperationDialog: false,
      // 分页参数
      page: {
        pageSizes: [2, 20, 30, 50],
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      // 过滤参数
      filter: {
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
          field: 'orderNum', // 列key
          label: '订单号', // 列头显示文本
          sortable: 'custom' // 排序
        },
        {
          field: 'createTime',
          label: '交易日期'
        },
        {
          field: 'orderPrice',
          label: '订单金额(元)'
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
    // 初始化过滤参数
    initFilter () {
      this.filter.name = ''
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
      this.getTableListData()
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
      invoiceApi.getInvoiceList(params).then(res => {
        this.tableData = res.data
        this.page.total = this.tableData.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
