<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/admin/class' }">班级管理</el-breadcrumb-item>
    <el-breadcrumb-item>课程计划管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="margin-top: 16px">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 8px">
      <el-input v-model="query_value" @keyup.enter.native="getClassCourseItems"
                placeholder="请输入关键字" style="width: 400px;">
        <template v-slot:prepend>
          课程名
        </template>
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="getClassCourseItems"></el-button>
        </template>
      </el-input>
      <div>
        <el-button v-if="selection.length" type="danger" @click="handleDelete(selectionIds)">删除</el-button>
        <el-button icon="el-icon-refresh" @click="getClassCourseItems"></el-button>
        <el-button type="primary" @click="handleAdd">添加课程计划</el-button>
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
          prop="name"
          label="课程名">
        <template v-slot="{row}">
          {{row.course.name}}
        </template>
      </el-table-column>
      <el-table-column
          prop="startTime"
          label="开始时间"
          width="180"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="endTime"
          label="结束时间"
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
          width="90">
        <template v-slot="{row}">
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete([row.course.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top: 16px;flex: 1">
    <el-pagination
        background
        @size-change="getClassCourseItems"
        @current-change="getClassCourseItems"
        :current-page.sync="page_num"
        :page-sizes="page_sizes"
        :page-size.sync="page_size"
        layout="total, sizes, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>

  <!-- 添加或修改参数配置对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="课程">
        <el-select v-model="form.courseId" style="width: 100%" placeholder="请选择">
          <el-option
              v-for="item in course_items"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止日期">
        <el-date-picker
            v-model="time_range"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
        </el-date-picker>
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
import * as class_course_request from "@/api/admin/class/course";
import * as course_request from "@/api/admin/course";
import {mapGetters} from "vuex";

export default {
  name: "UserIndex",
  computed: {
    ...mapGetters(['$text', 'token']),
    classId() {
      return this.$route.params.class_id
    },
    tableData() {
      let items = this.$lodash.cloneDeep(this.items)
      if(!items)
        return []
      for(let item of items){
        item.createTime = this.$helper.parseTime(item.createTime)
        item.startTime = this.$helper.parseTime(item.startTime)
        item.endTime = this.$helper.parseTime(item.endTime)
      }
      return items
    },
    selectionIds() {
      return this.selection.map(item => item.course.id)
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

      select_student: null,
      title: '',
      // 是否显示弹出层
      open: false,
      time_range: [],
      form: {},
      file_url: null,
      course_items: null
    }
  },
  created() {
    this.getClassCourseItems()
  },
  methods: {
    getALLCourseItems() {
      course_request.listAll().then((resp) => {
        if(resp.code === 200)
          this.course_items = resp.data
      })
    },
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
      this.time_range = []
      this.$helper.resetForm(this.$refs.form)
    },
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.classId = this.classId
          if (this.form.id !== undefined) {
            class_course_request.edit(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getClassCourseItems()
            })
          } else {
            this.form.startTime = this.time_range[0]
            this.form.endTime = this.time_range[1]
            class_course_request.add(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open = false

              this.getClassCourseItems()
            })
          }
        }
      })
    },
    handleEdit(item) {
      this.reset()
      this.getALLCourseItems()
      this.title = '编辑课程计划'
      this.form = this.$lodash.cloneDeep(item)
      this.time_range[0] = item.startTime
      this.time_range[1] = item.endTime
      this.open = true

    },
    handleAdd() {
      this.reset()
      this.getALLCourseItems()
      this.title = '添加课程计划'
      this.open = true
    },
    handleDelete(ids) {
      let del_ids = []
      ids.map(id => {
        del_ids.push({courseId: id, classId: this.classId})
      })
      console.log(del_ids)
      class_course_request.del(del_ids).then(
          resp => {
            if(resp.code === 200)
              this.getClassCourseItems()
          }
      )
    },
    getClassCourseItems() {
      class_course_request.list({
        class_id: this.classId,
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
