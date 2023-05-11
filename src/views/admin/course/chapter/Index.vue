<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/admin/course' }">课程管理</el-breadcrumb-item>
    <el-breadcrumb-item>章节管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div v-if="items && items.length" style="display:flex;flex-wrap: wrap;">
    <el-card v-for="chapter in items" :key="chapter.id" class="box-card" style="margin: 10px" shadow="hover">
      <template v-slot:header>
        <el-dropdown trigger="click" @command="cmd => handleChapterOperation(chapter, cmd)">
          <el-button type="text" style="padding: 0;">
                  <span class="card-text" style="color: #303133; font-size: 15px;">
                    {{ chapter.name }}
                  </span>
            <el-icon class="el-icon-arrow-down el-icon--right"></el-icon>
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit">
                <el-icon class="el-icon-edit"></el-icon>
                编辑
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <el-icon class="el-icon-delete"></el-icon>
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button style="float: right; padding: 3px 0" type="text"
                   @click="$refs.unit_dialog.open(chapter.id)">添加单元
        </el-button>
      </template>
      <el-empty v-if="chapter.unit.length === 0" description="空"></el-empty>
      <div v-else v-for="lesson in chapter.unit" :key="lesson.id" class="text item">
        <el-row :gutter="20">
          <el-col :span="20">
            <span class="card-text">{{ lesson.title }}</span>
          </el-col>
          <el-col :span="4">
            <el-dropdown style="margin-left: 8px; " trigger="click"
                         @command="cmd => handleLessonOperation(chapter,lesson, cmd)">
              <el-button type="text" style="padding: 0">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template v-slot:dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <el-icon class="el-icon-edit"></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="delete">
                    <el-icon class="el-icon-delete"></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
  <el-empty v-else>
    <el-button type="primary" @click="handleAdd">添加章节</el-button>
  </el-empty>
  <el-button v-if="items && items.length" type="primary" @click="handleAdd">添加章节</el-button>
  <!-- 添加或修改参数配置对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item
          label="章节名称"
      >
        <el-input
            v-model="form.name"
            placeholder="请输入课程章节名称"
            maxlength="30"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
  <UnitDialog ref="unit_dialog" @finish="getCourseChapterItems"></UnitDialog>
</div>
</template>

<script>
import * as course_chapter_request from "@/api/admin/course/chapter";
import {mapGetters} from "vuex";
import UnitDialog from "@/components/admin/course/UnitDialog.vue";
import * as unit_request from "@/api/admin/course/unit";

export default {
  name: "UserIndex",
  components: {UnitDialog},
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
          { required: true, message: '课程章节名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '课程章节名称长度必须介于 2 和 20 之间',
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
    handleLessonOperation(chapter,item, cmd) {
      let menu = {
        edit: () => this.$refs.unit_dialog.open(chapter.id, item),
        delete: () => this.deleteUnit([item.id]),
      }
      menu[cmd]()
    },
    handleChapterOperation(item, cmd) {
      let menu = {
        edit: () => this.handleEdit(item),
        delete: () => this.handleDelete([item.id]),
      }
      menu[cmd]()
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
      this.$helper.resetForm(this.$refs.form)
    },
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.courseId = this.courseId
          if (this.form.id !== undefined) {
            course_chapter_request.edit(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getCourseChapterItems()
            })
          } else {
            course_chapter_request.add(this.form).then(() => {
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
      this.title = '编辑课程章节'
      this.form = this.$lodash.cloneDeep(item)
      this.file_url = {name:item.fileKey, url:item.fileKey}
      this.open = true

    },
    handleAdd() {
      this.reset()
      this.title = '添加课程章节'
      this.open = true
    },
    deleteUnit(ids) {
      unit_request.del(ids).then(
          resp => {
            if(resp.code === 200)
              this.getCourseChapterItems()
          }
      )
    },

    handleDelete(ids) {
      course_chapter_request.del(ids).then(
          resp => {
            if(resp.code === 200)
              this.getCourseChapterItems()
          }
      )
    },
    getCourseChapterItems() {
      course_chapter_request.list({
        course_id: this.courseId,
        page_size: this.page_size,
        page_num: this.page_num,
        query_value: this.query_value
      }).then((resp) => {
        if (resp.code === 200) {
          this.items = resp.data
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
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.box-card {
  width: 480px;
}
.card-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 340px;
  text-align: left;
}
</style>
