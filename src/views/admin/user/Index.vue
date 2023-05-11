<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="margin-top: 16px">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 8px">
      <el-input v-model="query_value" @keyup.enter.native="getUserItems"
                placeholder="请输入关键字" style="width: 400px;">
        <template v-slot:prepend>
          用户名
        </template>
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="getUserItems"></el-button>
        </template>
      </el-input>
      <div>
        <el-button v-if="selection.length" type="danger" @click="handleDelete(selectionIds)">删除</el-button>
        <el-button icon="el-icon-refresh" @click="getUserItems"></el-button>
        <el-button type="primary" @click="handleAdd">添加用户</el-button>
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
          label="班级"
          width="120">
        <template v-slot="{row}">
          <el-tag v-if="row.classInfo" type="success">{{ row.className }}</el-tag>
          <span v-else style="color: grey">{{ row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名">
      </el-table-column>
      <el-table-column
          prop="nickName"
          label="昵称">
      </el-table-column>
      <el-table-column
          prop="userType_text"
          label="角色"
          width="120">
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
          width="290">
        <template v-slot="{row}">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete([row.id])">删除</el-button>
          <el-button size="mini" type="success"  icon="el-icon-s-promotion" @click="handleAddToClass(row)">分配班级</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top: 16px;flex: 1">
    <el-pagination
        background
        @size-change="getUserItems"
        @current-change="getUserItems"
        :current-page.sync="page_num"
        :page-sizes="page_sizes"
        :page-size.sync="page_size"
        layout="total, sizes, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>

  <!-- 添加或修改参数配置对话框 -->
  <el-dialog :title="title" destroy-on-close :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="用户名称"
              prop="username"
          >
            <el-input
                :disabled="!(form.id == null)"
                v-model="form.username"
                placeholder="请输入用户名称"
                maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="用户密码"
              prop="password"
          >
            <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input
                v-model="form.nickName"
                placeholder="请输入用户昵称"
                maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="userType">
            <el-select v-model="form.userType" placeholder="请选择">
              <el-option :key="'0'" label="管理员" :value="0" />
              <el-option :key="'1'" label="教师" :value="1" />
              <el-option :key="'2'" label="普通用户" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :key="0" :label="0">正常</el-radio>
              <el-radio :key="1" :label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option :key="'0'" label="男" :value="0" />
              <el-option :key="'1'" label="女" :value="1" />
              <el-option :key="'2'" label="未知" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="头像">
        <FileUpload picture_mode :picture_url="avatarUrl" @remove-file="form.avatar = null" @upload-success="handleAvatarSuccess"></FileUpload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>

  <el-dialog title="选择班级" destroy-on-close :visible.sync="open_class" width="450px" append-to-body>
    <el-form ref="form" :model="class_form" label-width="80px">
      <el-form-item label="班级">
        <div style="display: flex;width: 100%;justify-content: space-between">
          <el-select v-model="class_form.classId" placeholder="请选择">
            <el-option
                v-for="item in class_items"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="submitToClassForm">确 定</el-button>
        </div>

      </el-form-item>

    </el-form>
  </el-dialog>
</div>
</template>

<script>
import * as user_request from "@/api/admin/user";
import * as class_request from "@/api/admin/class/index";
import * as class_student_request from "@/api/admin/class/student";
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
        item.nickName = item.nickName || '（无昵称）'
        item.userType_text = this.$text.ROLE_TYPES[item.userType]
        item.className = item.classInfo? item.classInfo.name: '（未分配）'
      }
      return items
    },
    selectionIds() {
      return this.selection.map(item => item.id)
    },
    avatarUrl() {
      return this.form.avatar?getFileUrl(this.form.avatar):null
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
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '用户名称长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
        userType: [
          { required: true, message: '角色不能为空', trigger: 'blur' },
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '用户密码长度必须介于 5 和 20 之间',
            trigger: 'blur'
          }
        ],
      },
      form: {status:0,userType:2},
      open_class: false,
      class_form: {userId: null, classId: null},
      class_items: null
    }
  },
  created() {
    this.getUserItems()
  },
  methods: {
    handleAddToClass(item) {
      this.getALLClassItems()
      this.class_form = this.$options.data().class_form
      this.class_form.userId = item.id
      this.open_class = true
    },
    getALLClassItems() {
      class_request.listAll().then((resp) => {
        if(resp.code === 200)
          this.class_items = resp.data
      })
    },
    handleAvatarSuccess(res) {
      this.$set(this.form, 'avatar', res.data)
    },
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {status:0,userType:2}
      this.$helper.resetForm(this.$refs.form)
    },
    submitToClassForm() {
      class_student_request.add(this.class_form).then((res) => {
        this.$modal.msgSuccess(res.message)
        this.open_class = false
        this.class_form = {userId: null, classId: null}
        this.getUserItems();
      })
    },
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            user_request.editUser(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getUserItems()
            })
          } else {
            user_request.addUser(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open = false

              this.getUserItems()
            })
          }
        }
      })
    },
    handleEdit(item) {
      this.reset()
     this.title = '编辑用户'
      this.form = this.$lodash.cloneDeep(item)
      this.open = true
    },
    handleAdd() {
      this.reset()
      this.title = '添加用户'
      this.open = true
    },
    handleDelete(ids) {
      user_request.delUser(ids).then(
          resp => {
            if(resp.code === 200)
              this.getUserItems()
          }
      )
    },
    getUserItems() {
      user_request.listUser({page_size:this.page_size,page_num:this.page_num,query_value: this.query_value}).then((resp) => {
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

</style>
