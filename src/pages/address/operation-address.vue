<template>
  <div>
    <el-dialog :close-on-click-modal="false" :before-close="handleClose" width="500px" :title="title" :visible.sync="showDialog" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="formRules">
        <el-form-item label="发票抬头" prop="invoiceTitle" :label-width="formLabelWidth">
          <el-input placeholder="发票抬头" clearable size="small" v-model.trim="formData.invoiceTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发票税号" prop="dutyNumber" :label-width="formLabelWidth">
          <el-input placeholder="发票税号" clearable size="small" v-model.trim="formData.dutyNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户行" :label-width="formLabelWidth">
          <el-input placeholder="开户行" clearable size="small" v-model.trim="formData.bank" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOperationAddress('save')">确定</el-button>
        <el-button size="small" @click="handleOperationAddress('cancel')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'operation-address',
  props: {
    title: { // add | edit
      type: String,
      default: () => '新增收件地址'
    },
    address: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      showDialog: true,
      formLabelWidth: '120px',
      formRules: {
        province: [
          { required: true, message: '请选择省/市', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择市/区', trigger: 'blur' }
        ],
        county: [
          { required: true, message: '请选择县/区', trigger: 'blur' }
        ],
        des: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入收件人联系电话', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        recipient: [
          { required: true, message: '请输入收件人姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      formData: {
        'id': '',
        'province': '四川省',
        'city': '成都市',
        'county': '郫都区',
        'des': '红光镇华润橡树湾A区2栋',
        'tel': '17345951171',
        'recipient': '胡淼'
      }
    }
  },
  mounted () {
    this.initFormData()
  },
  methods: {
    initFormData () {
      if (this.address) {
        this.formData = this.address
        // this.formData.invoiceTitle = this.invoice.invoiceTitle
        // this.formData.dutyNumber = this.invoice.dutyNumber
        // this.formData.bank = this.invoice.bank
      }
    },
    handleClose () {
      this.handleOperationAddress('cancel')
    },
    handleOperationAddress (type) {
      if (type === 'save') {
        this.$refs['formRef'].validate((valid) => {
          if (valid) {
            this.$emit('save-event', this.formData)
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
