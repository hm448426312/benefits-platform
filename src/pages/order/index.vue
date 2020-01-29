<template>
  <div class="base-main">
    <div class="base-title">订单列表</div>
    <div class="base-content">
      <div class="base-action">
        <div class="base-btn">
          <el-button size="small" type="primary" :disabled="checkedRow.length === 0" @click="openInvoice()">批量开发票</el-button>
        </div>
        <div class="base-filter">
          <div class="base-filter-list">
            <span class="base-filter-list-label">订单状态</span>
            <el-select
              v-model="filter.status"
              clearable
              placeholder="全部"
              size="small"
            >
              <el-option
                v-for="item in payStatusList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="base-filter-list">
            <span class="base-filter-list-label">日期范围</span>
            <el-date-picker
              v-model="selectedDateRange"
              value-format="yyyy-MM-dd"
              @change="dateRangeChangeEvent"
              size="small"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <el-button @click="getTableListData" size="small" type="default">查询</el-button>
          <el-button @click="resetTableListData" size="small" type="default">重置</el-button>
        </div>
      </div>
      <div class="base-table">
        <el-table
          ref="myTable"
          :data="tableData"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          max-height="400px"
        >
          <!-- tableHeader循环外可加序号列、复选框列等 -->
          <el-table-column :selectable='tableCheckInit' type="selection" width="55"> </el-table-column>
<!--          <el-table-column type="index" label="序号" width="55"></el-table-column>-->
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
                    v-if="scope.row['status'] === payStatus.unPay"
                    type="text"
                    @click="toPay(scope.row, scope.$index)"
                  >去支付
                  </el-button>
                  <template v-if="scope.row['invoiceStatus'] === invoiceStatus.unInvoice">
                    <el-button
                      v-if="scope.row['status'] === payStatus.payEd"
                      type="text"
                      @click="openInvoice(scope.row, scope.$index)"
                    >开发票
                    </el-button>
                  </template>
                  <template v-else-if="scope.row['invoiceStatus'] === invoiceStatus.invoiceEd">
                    <el-button
                      type="text"
                      @click="viewExpress(scope.row, scope.$index)"
                    >查看快递
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button
                      type="text"
                      @click="getBackInvoice(scope.row, scope.$index)"
                    >收回
                    </el-button>
                  </template>
                </template>
                <template v-else-if="header.field === 'status'">
                  <span v-if="scope.row[header.field] === payStatus.payEd">已支付</span>
                  <span v-else-if="scope.row[header.field] === payStatus.unPay">未支付</span>
                  <span v-else>已取消</span>
                </template>
                <template v-else-if="header.field === 'invoiceStatus'">
                  <span v-if="scope.row[header.field] === invoiceStatus.unInvoice">未开票</span>
                  <span v-else-if="scope.row[header.field] === invoiceStatus.invoiceEd">已寄出</span>
                  <span v-else-if="scope.row[header.field] === invoiceStatus.invoiceIng">审核中</span>
                  <span v-else>--</span>
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
import * as orderApi from '@/api/order/index'
import * as globalMap from '@/global-map/index'

export default {
  name: 'index',
  data () {
    return {
      payStatus: globalMap.payStatus,
      invoiceStatus: globalMap.invoiceStatus,
      selectedOrder: null,
      showOperationDialog: false,
      checkedRow: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 分页参数
      page: {
        pageSizes: [2, 20, 30, 50],
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      payStatusList: [
        {
          name: '未支付',
          value: globalMap.payStatus.unPay
        }, {
          name: '已支付',
          value: globalMap.payStatus.payEd
        }, {
          name: '已取消',
          value: globalMap.payStatus.noPay
        }
      ],
      selectedDateRange: null,
      // 过滤参数
      filter: {
        startTime: '',
        endTime: '',
        status: ''
      },
      // 排序参数
      sort: {
        sort: '',
        order: ''
      },
      // 其他业务参数
      selfParams: {},
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
          label: '交易日期',
          sortable: 'custom' // 排序
        },
        {
          field: 'orderPrice',
          label: '订单金额(元)',
          sortable: 'custom', // 排序
          align: 'right'
        },
        {
          field: 'status',
          label: '订单状态',
          sortable: 'custom' // 排序
        },
        {
          field: 'invoiceStatus',
          label: '开票状态',
          sortable: 'custom' // 排序
        },
        {
          field: 'action',
          label: '操作',
          width: '200px' // 操作列一般固定宽度
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
    // 收回发票
    getBackInvoice (row, index) {

    },
    // 查看物流
    viewExpress (row, index) {

    },
    // 开发票
    openInvoice (row, index) {
      if (arguments.length === 0) {
        // 批量开具发票
        console.log('批量开具发票')
      } else {
        console.log('单独开具发票')
      }
    },
    // 去支付
    toPay (row, index) {

    },
    tableCheckInit (row, index) {
      if (row.status === this.payStatus.payEd && row.invoiceStatus === this.invoiceStatus.unInvoice) {
        return true
      } else {
        return false
      }
    },
    // 日期范围改变事件
    dateRangeChangeEvent () {
      if (this.selectedDateRange) {
        this.filter.startTime = this.selectedDateRange[0]
        this.filter.endTime = this.selectedDateRange[0]
      } else {
        this.filter.startTime = ''
        this.filter.endTime = ''
      }
    },
    handleSelectionChange (val) {
      this.checkedRow = val
      console.log(this.checkedRow)
    },
    // 初始化过滤参数
    initFilter () {
      this.filter.status = ''
      this.filter.endTime = ''
      this.filter.startTime = ''
      this.selectedDateRange = null
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
      orderApi.getOrderList(params).then(res => {
        this.tableData = res.data
        this.page.total = this.tableData.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
