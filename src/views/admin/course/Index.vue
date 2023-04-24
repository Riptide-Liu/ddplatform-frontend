<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>课程管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="margin-top: 16px">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 8px">
      <el-input v-model="query_value" @keyup.enter.native="getCourseItems"
                placeholder="请输入关键字" style="width: 400px;">
        <template v-slot:prepend>
          课程名
        </template>
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="getCourseItems"></el-button>
        </template>
      </el-input>
      <div>
        <el-button v-if="selection.length" type="danger" @click="handleDelete(selectionIds)">删除</el-button>
        <el-button icon="el-icon-refresh" @click="getCourseItems"></el-button>
        <el-button type="primary" @click="handleAdd">添加课程</el-button>
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
          label="课程名">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述">
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
          width="260">
        <template v-slot="{row}">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete([row.id])">删除</el-button>
          <el-dropdown trigger="click" @command="(args) => handleCommand(args, row)">
            <el-button type="primary" size="mini" style="margin-left: 10px">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="resource">
                  <el-icon class="el-icon-document"></el-icon>
                  资源管理
                </el-dropdown-item>
                <el-dropdown-item command="chapter">
                  <el-icon class="el-icon-reading"></el-icon>
                  章节管理
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top: 16px;flex: 1">
    <el-pagination
        background
        @size-change="getCourseItems"
        @current-change="getCourseItems"
        :current-page.sync="page_num"
        :page-sizes="page_sizes"
        :page-size.sync="page_size"
        layout="total, sizes, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>

  <!-- 添加或修改参数配置对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item
          label="课程名称"
          prop="username"
      >
        <el-input
            v-model="form.name"
            placeholder="请输入课程名称"
            maxlength="30"
        />
      </el-form-item>
      <el-form-item
          label="简述"
          prop="description"
      >
        <el-input
            v-model="form.description"
            placeholder="请输入课程名称"
            maxlength="30"
        />
      </el-form-item>
      <el-form-item label="封面图片">
        <FileUpload picture_mode :picture_url="imageUrl" @upload-success="handleUploadSuccess"></FileUpload>
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
import * as course_request from "@/api/admin/course/index";
import {mapGetters} from "vuex";
import {getFileUrl} from "@/api/file";
import FileUpload from "@/components/common/FileUpload.vue";

export default {
  name: "UserIndex",
  components: {FileUpload},
  computed: {
    ...mapGetters(['$text', 'token']),
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
    imageUrl() {
      return this.form.imageKey?getFileUrl(this.form.imageKey):null
    },
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
          { required: true, message: '课程名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '课程名称长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
      },
      form: {},
    }
  },
  created() {
    this.getCourseItems()
  },
  methods: {
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleUploadSuccess(res) {
      this.$set(this.form, 'imageKey', res.data)
    },
    handleCommand(command, item) {
      let menu = {
        'resource': () => {
          this.$router.push(`course/${item.id}/resource`)
        },
        'chapter': () => {
          this.$router.push(`course/${item.id}/chapter`)
        },
      }
      if(menu[command])
        menu[command]()
    },
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {}
      this.$helper.resetForm(this.$refs.form)
    },
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            course_request.edit(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getCourseItems()
            })
          } else {
            course_request.add(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open = false

              this.getCourseItems()
            })
          }
        }
      })
    },
    handleEdit(item) {
      this.reset()
     this.title = '编辑课程'
      this.form = this.$lodash.cloneDeep(item)
      this.open = true
    },
    handleAdd() {
      this.reset()
      this.title = '添加课程'
      this.open = true
    },
    handleDelete(ids) {
      course_request.del(ids).then(
          resp => {
            if(resp.code === 200)
              this.getCourseItems()
          }
      )
    },
    getCourseItems() {
      course_request.list({page_size:this.page_size,page_num:this.page_num,query_value: this.query_value}).then((resp) => {
        if(resp.code === 200){
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
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
