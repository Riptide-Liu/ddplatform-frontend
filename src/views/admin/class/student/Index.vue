<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/admin/class' }">班级管理</el-breadcrumb-item>
    <el-breadcrumb-item>学生管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="margin-top: 16px">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 8px">
      <el-input v-model="query_value" @keyup.enter.native="getStudentItems"
                placeholder="请输入关键字" style="width: 400px;">
        <template v-slot:prepend>
          学生名
        </template>
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="getStudentItems"></el-button>
        </template>
      </el-input>
      <div>
        <el-button v-if="selection.length" type="danger" @click="handleDelete(selectionIds)">删除</el-button>
        <el-button icon="el-icon-refresh" @click="getStudentItems"></el-button>
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
          label="学生名">
        <template v-slot="{row}">
          {{row.nickName || row.username}}
        </template>
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
          width="90">
        <template v-slot="{row}">
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete([row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top: 16px;flex: 1">
    <el-pagination
        background
        @size-change="getStudentItems"
        @current-change="getStudentItems"
        :current-page.sync="page_num"
        :page-sizes="page_sizes"
        :page-size.sync="page_size"
        layout="total, sizes, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>

</div>
</template>

<script>
import * as student_request from "@/api/admin/class/student";
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
        item.updateTime = this.$helper.parseTime(item.updateTime)
      }
      return items
    },
    selectionIds() {
      return this.selection.map(item => item.id)
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
    }
  },
  created() {
    this.getStudentItems()
  },
  methods: {
    handleDelete(ids) {
      let del_ids = []
      ids.map(id => {
        del_ids.push({userId: id, classId: this.classId})
      })
      student_request.del(del_ids).then(
          resp => {
            if(resp.code === 200)
              this.getStudentItems()
          }
      )
    },
    getStudentItems() {
      student_request.list({
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
