<template>
  <div class="base-main">
    <div class="base-title">商品列表</div>
    <div class="base-content">
      <div class="base-action">
        <div class="base-btn">
          <el-button @click="addGoodEvent" type="primary" size="small">新增商品</el-button>
          <el-button type="default" size="small">导入</el-button>
          <el-button type="default" size="small">导出</el-button>
        </div>
        <div class="base-filter">
          <el-select
            v-model="filter.selectedClassify"
            clearable
            placeholder="全部"
            @change="classifyChangeEvent"
            size="small"
          >
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model="filter.selectedSubClassify"
            clearable
            placeholder="全部"
            size="small"
          >
            <el-option
              v-for="item in subClassifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input size="small" v-model.trim="filter.name" placeholder="请输入商品名称" clearable></el-input>
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
                  <el-button
                    type="text"
                    @click="reviewEnterpriseDetail(scope.row, scope.$index)"
                  >删除
                  </el-button>
                </template>
                <template v-else-if="header.field === 'classify'">
                  <span>{{scope.row['classify'].name}}</span>
                </template>
                <template v-else-if="header.field === 'subClassify'">
                  <span>{{scope.row['classify'].subName}}</span>
                </template>
                <template v-else-if="header.field === 'unitValue'">
                  <span>{{scope.row[header.field]}} {{scope.row['unit']}}</span>
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
    <operation-good
      v-if="showOperationDialog"
      :good-data="selectedGood"
      @save-event="operationGoodCallBak"
      @cancel-event="showOperationDialog = false"
    >
    </operation-good>
  </div>
</template>

<script>
import * as goodsApi from '@/api/goods/index'
import OperationGood from './operation-good'

export default {
  name: 'index',
  components: {OperationGood},
  data () {
    return {
      selectedGood: null,
      showOperationDialog: false,
      // 分页参数
      page: {
        pageSizes: [2, 20, 30, 50],
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      // 商品子类列表
      subClassifyList: [],
      // 商品大类列表
      classifyList: [],
      // 过滤参数
      filter: {
        selectedClassify: '',
        selectedSubClassify: '',
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
          label: '商品名称', // 列头显示文本
          sortable: 'custom' // 排序
        },
        {
          field: 'classify',
          label: '商品大类'
        },
        {
          field: 'subClassify',
          label: '商品子类'
        },
        {
          field: 'sells',
          label: '售价(元)',
          align: 'right'
        },
        {
          field: 'price',
          label: '原价(元)',
          align: 'right'
        },
        {
          field: 'unitValue',
          label: '单位',
          align: 'right'
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
    this.getClassifyList()
    this.getTableListData()
  },
  methods: {
    operationGoodCallBak (good) {
      console.log(good)
      this.showOperationDialog = false
    },
    // 新增商品点击事件
    addGoodEvent () {
      this.selectedGood = null
      this.showOperationDialog = true
    },
    // 商品大类change事件
    classifyChangeEvent () {
      this.filter.selectedSubClassify = ''
      if (this.filter.selectedClassify) {
        this.getSubClassifyList()
      } else {
        this.subClassifyList = []
      }
    },
    // 获取商品大类
    async getClassifyList () {
      await new Promise((resolve, reject) => {
        goodsApi.getGoodsClassify().then(res => {
          this.classifyList = res.data
        }).finally(() => {
          resolve()
        })
      })
    },
    // 获取商品子类
    getSubClassifyList () {
      goodsApi.getGoodsSubClassify().then(res => {
        this.subClassifyList = res.data
      })
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
      goodsApi.getGoodsList(params).then(res => {
        this.tableData = res.data
        this.page.total = this.tableData.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
