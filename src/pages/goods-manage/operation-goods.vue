<template>
    <div>
      <el-dialog width="500px" :title="title" :visible.sync="showDialog" append-to-body>
        <el-form ref="goodFormRef" :model="goodForm" :rules="goodRules">
          <template v-if="this.parentGood !== null">
            <el-form-item label="商品分类名称" prop="name" :label-width="formLabelWidth">
              <el-input :disabled="true" clearable autofocus="true" v-model="goodForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品子类名称" prop="subName" :label-width="formLabelWidth">
              <el-input clearable autofocus="true" v-model="goodForm.subName" autocomplete="off"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="商品分类名称" prop="name" :label-width="formLabelWidth">
              <el-input clearable autofocus="true" v-model="goodForm.name" autocomplete="off"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleOperationGood('save')">确定</el-button>
          <el-button @click="handleOperationGood('cancel')">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'operation-goods',
  props: {
    title: { // add | edit
      type: String,
      default: () => '新增商品分类'
    },
    type: { // add | edit
      type: String,
      default: () => ''
    },
    good: {
      type: Object,
      default: () => {}
    },
    parentGood: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      showDialog: true,
      formLabelWidth: '120px',
      goodRules: {
        name: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        subName: [
          { required: true, message: '请输入商品子类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      goodForm: {
        id: '',
        name: '',
        subName: ''
      }
    }
  },
  mounted () {
    this.initGoodForm()
  },
  methods: {
    initGoodForm () {
      this.goodForm.id = this.good.id || ''
      if (this.parentGood) {
        this.goodForm.name = this.parentGood.name || ''
        this.goodForm.subName = this.good.name || ''
      } else {
        this.goodForm.name = this.good.name || ''
      }
    },
    handleOperationGood (type) {
      if (type === 'save') {
        this.$refs['goodFormRef'].validate((valid) => {
          if (valid) {
            this.$emit('save-event', {
              goodForm: this.goodForm,
              parentGood: this.parentGood
            })
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

</style>
