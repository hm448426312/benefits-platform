<template>
  <div>
    <el-dialog :close-on-click-modal="false" :before-close="handleClose" width="500px" top="30px" :title="title" :visible.sync="showDialog" append-to-body>
      <el-form class="my-form" ref="goodFormRef" :model="goodForm" :rules="goodRules">
        <el-form-item label="商品名称" prop="name" :label-width="formLabelWidth">
          <el-input size="small" clearable placeholder="请输入商品名称" v-model.trim="goodForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品大类" prop="classifyId" :label-width="formLabelWidth">
          <el-select
            v-model="goodForm.classifyId"
            clearable
            placeholder="请选择商品大类"
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
        </el-form-item>
        <el-form-item label="商品子类" prop="subClassifyId" :label-width="formLabelWidth">
          <el-select
            clearable
            v-model="goodForm.subClassifyId"
            placeholder="请选择商品子类"
            size="small"
          >
            <el-option
              v-for="item in subClassifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品原价" prop="price" :label-width="formLabelWidth">
          <el-input size="small" clearable placeholder="请输入商品原价" v-model.trim="goodForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="sells" :label-width="formLabelWidth">
          <el-input size="small" clearable placeholder="请输入商品售价" v-model.trim="goodForm.sells" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品单位" prop="unitValue" :label-width="formLabelWidth">
          <div class="good-unit-box">
            <el-form-item prop="unitValue">
              <el-input placeholder="请输入商品单位值" clearable size="small" v-model.trim="goodForm.sells" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="unit">
              <el-select
                v-model="goodForm.unit"
                placeholder="请选择商品单位"
                size="small"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="商品图片" prop="img" :label-width="formLabelWidth">
          请上传图片
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOperationGood('save')">确定</el-button>
        <el-button size="small" @click="handleOperationGood('cancel')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as goodsApi from '@/api/goods/index'
export default {
  name: 'operation-good',
  props: {
    title: {
      type: String,
      default: () => '新增商品'
    },
    goodData: {
      type: Object,
      default: () => null
    }
  },
  data () {
    var checkNumber = (rule, value, callback) => {
      if (value === '' || value == null) {
        return callback(new Error('年龄不能为空'))
      }
      if (!isNaN(value)) {
        return callback()
      } else {
        return callback(new Error('请输入数字值'))
      }
    }
    return {
      formLabelWidth: '100px',
      showDialog: true,
      classifyList: [],
      subClassifyList: [],
      unitList: [
        {
          name: 'g',
          id: '1'
        }, {
          name: 'ml',
          id: '2'
        }, {
          name: '个',
          id: '3'
        }, {
          name: '盒',
          id: '4'
        }, {
          name: '袋',
          id: '5'
        }
      ],
      goodForm: {
        name: '',
        id: '',
        img: '',
        price: '',
        sells: '',
        unit: '1',
        unitValue: '',
        classifyId: '',
        classifyName: '',
        subClassifyId: '',
        subClassifyName: ''
      },
      goodRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传商品图片', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品原价', trigger: 'blur' },
          { 'validator': checkNumber, trigger: 'blur' }
        ],
        sells: [
          { required: true, message: '请输入商品售价', trigger: 'blur' },
          { 'validator': checkNumber, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        unitValue: [
          { required: true, message: '请输入单位值', trigger: 'blur' },
          { 'validator': checkNumber, trigger: 'blur' }
        ],
        classifyId: [
          { required: true, message: '请选择商品大类', trigger: 'change' }
        ],
        subClassifyId: [
          { required: true, message: '请选择商品子类', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getClassifyList()
    this.initShowGoodData()
  },
  methods: {
    // 获取商品大类
    getClassifyList () {
      goodsApi.getGoodsClassify().then(res => {
        this.classifyList = res.data
      })
    },
    // 商品大类change事件
    classifyChangeEvent () {
      this.goodForm.subClassifyId = ''
      if (this.goodForm.classifyId) {
        this.getSubClassifyList()
      } else {
        this.subClassifyList = []
      }
    },
    // 获取商品子类
    getSubClassifyList () {
      goodsApi.getGoodsSubClassify().then(res => {
        this.subClassifyList = res.data
      })
    },
    initShowGoodData () {
    },
    handleClose () {
      this.handleOperationGood('cancel')
    },
    handleOperationGood (type) {
      if (type === 'save') {
        this.$refs['goodFormRef'].validate((valid) => {
          if (valid) {
            this.$emit('save-event', this.goodForm)
          } else {
            this.$message({
              message: '输入不合法，请检查后再提交。',
              type: 'error'
            })
            return false
          }
        })
      } else {
        this.$emit('cancel-event')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-body{
    padding: 20px;
  }
  .my-form{
    .el-form-item{
      margin-bottom: 18px;
      .el-form-item{
        margin-bottom: 0;
      }
    }
  }
.good-unit-box{
  display: flex;
  flex-direction: row;
  > *{
    &:last-child{
      margin-left: 20px;
      width: 100px;
    }
  }
}
</style>
