<template>
  <div class="base-main">
    <div class="base-title">收件地址管理</div>
    <div class="base-content">
      <div class="base-action">
        <div class="base-btn">
          <el-button size="small" type="primary" @click="addAddressEvent">新增收件地址</el-button>
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
          <el-table-column type="selection" width="55"> </el-table-column>
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
                    type="text"
                    @click="editAddressEvent(scope.row, scope.$index)"
                  >编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="deleteRow(scope.row, scope.$index)"
                  >删除
                  </el-button>
                </template>
                <template v-else-if="header.field === 'address'">
                  <span>{{getAddressDetail(scope.row)}}</span>
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
    <operation-address
      v-if="operationData.showDialog"
      :title="operationData.title"
      :address="operationData.address"
      @save-event="operationAddressCallBak"
      @cancel-event="operationData.showDialog = false"
    ></operation-address>
  </div>
</template>

<script>
import * as addressApi from '@/api/address/index'
import OperationAddress from './operation-address'

export default {
  name: 'index',
  components: {OperationAddress},
  data () {
    return {
      selectedOrder: null,
      operationData: {
        showDialog: false,
        title: '新增收件地址',
        invoice: null
      },
      checkedRow: [],
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
          field: 'recipient',
          label: '收件人'
        },
        {
          field: 'tel',
          label: '联系电话'
        },
        {
          field: 'address', // 列key
          label: '详细地址', // 列头显示文本
          width: '500px'
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
    getAddressDetail (row) {
      const url = `${row.province}${row.city}${row.county}${row.des}`
      return url
    },
    // 删除
    deleteRow (row, index) {
      if (this.tableData.length === 1) {
        this.page.currentPage = 1
      }
      this.getTableListData()
    },
    // 编辑发票抬头点击事件
    editAddressEvent (row, index) {
      this.operationData.title = '编辑收件地址'
      this.operationData.address = row
      this.operationData.showDialog = true
    },
    // 新增发票抬头点击事件
    addAddressEvent () {
      this.operationData.title = '新增收件地址'
      this.operationData.address = null
      this.operationData.showDialog = true
    },
    operationAddressCallBak (address) {
      this.operationData.showDialog = false
    },
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
    handleSelectionChange (val) {
      this.checkedRow = val
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
      addressApi.getAddressList(params).then(res => {
        this.tableData = res.data
        this.page.total = this.tableData.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
