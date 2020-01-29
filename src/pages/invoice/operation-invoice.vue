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
        <el-button size="small" type="primary" @click="handleOperationInvoice('save')">确定</el-button>
        <el-button size="small" @click="handleOperationInvoice('cancel')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'operation-invoice',
  props: {
    title: { // add | edit
      type: String,
      default: () => '新增发票抬头'
    },
    invoice: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      showDialog: true,
      formLabelWidth: '120px',
      formRules: {
        invoiceTitle: [
          { required: true, message: '请输入发票抬头', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        dutyNumber: [
          { required: true, message: '请输入发票税号', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      formData: {
        id: '',
        invoiceTitle: '',
        dutyNumber: '',
        bank: ''
      }
    }
  },
  mounted () {
    this.initFormData()
  },
  methods: {
    initFormData () {
      if (this.invoice) {
        this.formData = this.invoice
        // this.formData.invoiceTitle = this.invoice.invoiceTitle
        // this.formData.dutyNumber = this.invoice.dutyNumber
        // this.formData.bank = this.invoice.bank
      }
    },
    handleClose () {
      this.handleOperationInvoice('cancel')
    },
    handleOperationInvoice (type) {
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
