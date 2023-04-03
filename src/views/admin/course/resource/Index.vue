<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/admin/course' }">课程管理</el-breadcrumb-item>
    <el-breadcrumb-item>资源管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="margin-top: 16px">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 8px">
      <el-input v-model="query_value" @keyup.enter.native="getCourseChapterItems"
                placeholder="请输入关键字" style="width: 400px;">
        <template v-slot:prepend>
          课程资源名
        </template>
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="getCourseChapterItems"></el-button>
        </template>
      </el-input>
      <div>
        <el-button v-if="selection.length" type="danger" @click="handleDelete(selectionIds)">删除</el-button>
        <el-button icon="el-icon-refresh" @click="getCourseChapterItems"></el-button>
        <el-button type="primary" @click="handleAdd">添加课程资源</el-button>
      </div>

    </div>
    <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%;height: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          show-overflow-tooltip
          label="ID">
      </el-table-column>
      <el-table-column
          prop="name"
          label="课程资源名">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          label="操作"
          width="180">
        <template v-slot="{row}">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete([row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top: 16px;flex: 1">
    <el-pagination
        background
        @size-change="getCourseChapterItems"
        @current-change="getCourseChapterItems"
        :current-page.sync="page_num"
        :page-sizes="page_sizes"
        :page-size.sync="page_size"
        layout="total, sizes, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>

  <!-- 添加或修改参数配置对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item
          label="资源名称"
      >
        <el-input
            v-model="form.name"
            placeholder="请输入课程资源名称"
            maxlength="30"
        />
      </el-form-item>
      <el-form-item label="资源上传">
        <el-upload
            action="http://localhost:8081/file/upload"
            :headers="{token}"
            :limit="1"
            :file-list="fileList"
            :on-success="handleUploadSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>

</div>
</template>

<script>
import * as course_resource_request from "@/api/admin/course/resource";
import {mapGetters} from "vuex";

export default {
  name: "UserIndex",
  computed: {
    ...mapGetters(['$text', 'token']),
    courseId() {
      return this.$route.params.course_id
    },
    tableData() {
      let items = this.$lodash.cloneDeep(this.items)
      if(!items)
        return []
      for(let item of items){
        item.createTime = this.$helper.parseTime(item.createTime)
        item.updateTime = this.$helper.parseTime(item.updateTime)
      }
      return items
    },
    selectionIds() {
      return this.selection.map(item => item.id)
    },
    fileList() {
      return this.file_url?[this.file_url]:[]
    }
  },
  data() {
    return {
      page_size: 10,
      page_num: 1,
      total: 0,
      query_value: '',
      page_sizes: [10, 20, 50, 100],
      items: null,
      selection: [],


      title: '',
      // 是否显示弹出层
      open: false,
      rules: {
        name: [
          { required: true, message: '课程资源名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '课程资源名称长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
      },
      form: {},
      file_url: null
    }
  },
  created() {
    this.getCourseChapterItems()
  },
  methods: {
    handleUploadSuccess(res) {
      this.form.fileKey = res.data
    },
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.file_url = null
      this.form = {}
      this.$helper.resetForm(this.$refs.form)
    },
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.courseId = this.courseId
          if (this.form.id !== undefined) {
            course_resource_request.edit(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getCourseChapterItems()
            })
          } else {
            course_resource_request.add(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open = false

              this.getCourseChapterItems()
            })
          }
        }
      })
    },
    handleEdit(item) {
      this.reset()
      this.title = '编辑课程资源'
      this.form = this.$lodash.cloneDeep(item)
      this.file_url = {name:item.fileKey, url:item.fileKey}
      this.open = true

    },
    handleAdd() {
      this.reset()
      this.title = '添加课程资源'
      this.open = true
    },
    handleDelete(ids) {
      course_resource_request.del(ids).then(
          resp => {
            if(resp.code === 200)
              this.getCourseChapterItems()
          }
      )
    },
    getCourseChapterItems() {
      course_resource_request.list({
        course_id: this.courseId,
        page_size: this.page_size,
        page_num: this.page_num,
        query_value: this.query_value
      }).then((resp) => {
        if (resp.code === 200) {
          this.items = resp.data.items
          this.total = resp.data.total
          this.page_size = resp.data.pageSize
          this.page_num = resp.data.pageNum
        }

      })
    },
    handleSelectionChange(selection) {
      this.selection = selection
    }
  }
}
</script>

<style scoped>
</style>
