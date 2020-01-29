<template>
  <div>
    <el-dialog :close-on-click-modal="false" :before-close="handleClose" width="500px" title="审核" :visible.sync="showReviewDialog" append-to-body>
      <el-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules">
        <el-form-item label="审核结果" prop="status" :label-width="formLabelWidth">
          <el-radio-group v-model="reviewForm.status">
            <el-radio size="small" label="pass">通过</el-radio>
            <el-radio size="small" label="reject">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核理由" prop="desc" :label-width="formLabelWidth">
          <el-input
            minlength="2" maxlength="30" rows="3"
            show-word-limit type="textarea" clearable
            v-model="reviewForm.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOperationEnterprise('save')">确定</el-button>
        <el-button size="small" @click="handleOperationEnterprise('cancel')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'enterprise-review',
  props: {

  },
  data () {
    return {
      showReviewDialog: true,
      formLabelWidth: '120px',
      reviewForm: {
        status: 'pass', // pass | reject
        desc: ''
      },
      reviewRules: {
        status: [
          {required: true, message: '请输入理由', trigger: 'change'}
        ],
        desc: [
          {required: true, message: '请输入理由', trigger: 'blur'},
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      this.handleOperationEnterprise('cancel')
    },
    handleOperationEnterprise (type) {
      if (type === 'save') {
        this.$refs['reviewFormRef'].validate((valid) => {
          if (valid) {
            this.$emit('save-event', this.reviewForm)
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
    },
    saveReviewData (data) {
      console.log(data, this.reviewObj.enterprise, 'saveReviewData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
