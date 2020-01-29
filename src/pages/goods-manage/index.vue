<template>
  <div class="base-main">
    <div class="base-title">商品分类管理</div>
    <div class="base-content">
      <div class="base-action">
        <div class="base-btn">
          <el-button @click="addGoodClassify" size="small" type="primary">新建商品分类</el-button>
          <el-button @click="addGoodSubClassify" size="small" :disabled="!(selectedGood && !selectedGood.parentId)"
                     type="primary">新建商品子类
          </el-button>
        </div>
        <div class="base-filter">
          <div class="base-filter-list">
            <span class="base-filter-list-label">商品大类</span>
            <el-select
              v-model="filter.selectedGoodClassify"
              clearable placeholder="全部"
              size="small"
            >
              <el-option
                v-for="item in goodsClassify"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
          style="width: 100%"
          max-height="400px"
          highlight-current-row
          @current-change="handleCurrentChange"
          row-key="id"
          :tree-props="{children: 'children'}"
        >
          <!-- tableHeader循环外可加序号列、复选框列等 -->
          <!--            <el-table-column type="selection" width="55"> </el-table-column>-->
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
                    @click.stop="editGoodClassify(scope.row, scope.$index)"
                  >编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click.stop="deleteGood(scope.row, scope.$index)"
                  >删除
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
          @current-change="handleCurrentSizeChange"
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
    <operation-good-classify
      v-if="operationObj.showOperationDialog"
      :title="operationObj.title"
      :type="operationObj.type"
      :good="operationObj.good"
      :parentGood="operationObj.parentGood"
      @save-event="operationGoodClassifyCallBak"
      @cancel-event="operationObj.showOperationDialog = false"
    ></operation-good-classify>
  </div>
</template>

<script>
import * as goodsApi from '@/api/goods/index'
import OperationGoodClassify from './operation-good-classify'

export default {
  name: 'index',
  components: {OperationGoodClassify},
  data () {
    return {
      operationObj: {
        showOperationDialog: false,
        type: 'add',
        title: '新增商品分类',
        good: {},
        parentGood: null,
        index: -1
      },
      // 商品分类
      goodsClassify: [],
      selectedGood: null,
      // 分页参数
      page: {
        pageSizes: [2, 20, 30, 50],
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      // 过滤参数
      filter: {
        selectedGoodClassify: ''
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
          field: 'name', // 列key
          label: '商品名称', // 列头显示文本
          flex: 1,
          sortable: 'custom' // 排序
        },
        {
          field: 'action',
          label: '操作',
          width: '500px' // 操作列一般固定宽度
        }
      ]
    }
  },
  mounted () {
    this.initPage()
    this.initFilter()
    this.initSort()
    this.getGoodsClassify()
    this.getTableListData()
  },
  methods: {
    deleteGood (good, index) {
      this.tableData.splice(index, 1)
      if (this.selectedGood && good === this.selectedGood) {
        this.selectedGood = null
      }
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    updateGood (goodObj) {
      if (goodObj.parentGood) {
        this.operationObj.good.name = goodObj.goodForm.subName
      } else {
        this.operationObj.good.name = goodObj.goodForm.name
      }
    },
    operationGoodClassifyCallBak (goodObj) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      if (this.operationObj.type === 'add') {
        this.getTableListData()
      } else {
        this.updateGood(goodObj)
      }
      this.operationObj.showOperationDialog = false
    },
    getTableRowByKey (data = [], key, val) {
      let res = null
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] === val) {
          res = data[i]
          break
        }
      }
      return res
    },
    editGoodClassify (good, index) {
      this.operationObj.type = 'edit'
      this.operationObj.title = '编辑商品分类'
      this.operationObj.good = good
      if (good.parentId) {
        this.operationObj.parentGood = this.getTableRowByKey(this.tableData, 'id', good.parentId)
      } else {
        this.operationObj.parentGood = null
      }
      this.operationObj.index = index
      this.operationObj.showOperationDialog = true
    },
    addGoodSubClassify () {
      if (!this.selectedGood) {
        this.$message({
          message: '请选择商品大类',
          type: 'error'
        })
        return false
      }
      this.operationObj.type = 'add'
      this.operationObj.title = '新增商品子类'
      this.operationObj.good = {}
      this.operationObj.parentGood = this.selectedGood
      this.operationObj.index = -1
      this.operationObj.showOperationDialog = true
    },
    addGoodClassify () {
      this.operationObj.type = 'add'
      this.operationObj.title = '新增商品分类'
      this.operationObj.good = {}
      this.operationObj.parentGood = null
      this.operationObj.index = -1
      this.operationObj.showOperationDialog = true
    },
    handleCurrentChange (val) {
      this.selectedGood = val
    },
    // 获取商品大类
    getGoodsClassify () {
      goodsApi.getGoodsClassify().then(res => {
        this.goodsClassify = res.data
      })
    },
    // 初始化过滤参数
    initFilter () {
      this.filter.selectedGoodClassify = ''
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
    handleCurrentSizeChange (page) {
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
      goodsApi.getGoodsManageList(params).then(res => {
        this.tableData = res.data
        this.page.total = this.tableData.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
