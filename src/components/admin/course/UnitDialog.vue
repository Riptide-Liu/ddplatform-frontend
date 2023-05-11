<template>
  <el-dialog destroy-on-close :title="title" :before-close="beforeClose"	 :visible.sync="open_dialog" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item
          label="单元标题"
      >
        <el-input
            v-model="form.title"
            placeholder="请输入课程单元标题"
            maxlength="30"
        />
      </el-form-item>
      <el-form-item
          label="内容"
      >
        <Editor v-model="form.content" placeholder="请输入课程单元内容" style="padding-top: 8px;margin-bottom: -8px"></Editor>
      </el-form-item>
      <el-form-item label="课件上传">
        <FileUpload pdf_mode :file-list="fileList" :limit="1" @upload-success="handleUploadSuccess"></FileUpload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="open_dialog = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import FileUpload from "@/components/common/FileUpload.vue";
import * as unit_request from "@/api/admin/course/unit";
import Editor from "@/components/common/Editor.vue";

export default {
  name: "unitDialog",
  components: {FileUpload, Editor},
  computed: {
    fileList() {
      return this.file_url?[this.file_url]:[]
    }
  },
  data() {
    return {
      title: '',
      // 是否显示弹出层
      open_dialog: false,
      rules: {
        name: [
          { required: true, message: '课程单元标题不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '课程单元标题长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
      },
      form: {},
      file_url: null,
      chapter_id: null
    }
  },
  methods: {
    beforeClose(done) {
      Object.assign(this.$data, this.$options.data())
      done()
    },
    handleUploadSuccess(res) {
      this.form.fileKey = res.data
    },
    // 表单重置
    reset() {
      this.file_url = null
      this.form = {}
      this.$helper.resetForm(this.$refs.form)
    },
    open(chapter_id, item) {
      Object.assign(this.$data, this.$options.data())
      this.chapter_id = chapter_id
      if(item)
        this.handleEdit(item)
      this.open_dialog = true
    },
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.chapter_id)
            this.form.chapterId = this.chapter_id
          if (this.form.id !== undefined) {
            unit_request.edit(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open_dialog = false
              this.$emit('finish')
            })
          } else {
            unit_request.add(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open_dialog = false
              this.$emit('finish')
            })
          }
        }
      })
    },
    handleEdit(item) {
      this.reset()
      this.title = '编辑章节单元'
      this.form = this.$lodash.cloneDeep(item)
      if(item.fileKey){
        this.file_url = {}
        this.$set(this.file_url, 'name', item.fileKey)
        this.$set(this.file_url, 'url', item.fileKey)
      }


      this.open_dialog = true

    },
    handleAdd() {
      this.reset()
      this.title = '添加章节单元'
      this.open_dialog = true
    },
  }
}
</script>

<style scoped>

</style>
