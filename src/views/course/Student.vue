<template>
<el-card  style="border-radius: 16px;min-height: calc(100vh - 100px);">
  <template v-slot:header>同班同学</template>
  <div style="display: flex;flex-flow: wrap">
    <div v-for="(student, index) of studentItems" :key="index" class="item">
      <el-avatar :src="student.avatar"
                 :size="80"></el-avatar>
      <div style="height: 40px; line-height: 40px;font-size: 14px;">{{student.username}}</div>
    </div>
  </div>
  <el-empty v-if="!studentItems.length" style="height: 100%;width: 100%"></el-empty>
</el-card>
</template>

<script>
import * as course_request from "@/api/course";
import {getFileUrl} from "@/api/file";
export default {
  name: "CourseResource",
  computed: {
    courseId() {
      return this.$route.params.course_id
    },
    studentItems() {
      let items = this.$lodash.cloneDeep(this.items)
      if(!items)
        items = []
      for(let item of items) {
        item.avatar = item.avatar?getFileUrl(item.avatar):require('@/assets/img/user/avatar.webp')
      }
      return items
    }
  },
  data() {
    return {
      items: null
    }
  },
  created() {
    this.getStudentItems()
  },
  methods: {
    getStudentItems() {
      course_request.getStudent().then(
          resp => {
            if(resp.code === 200)
              this.items = resp.data
          }
      )
    }
  }
}
</script>

<style scoped>
/deep/ .el-page-header__content{
  width: 100%;
}

.item {
  text-align: center;
  width: 80px;
  padding: 40px 15px 10px;
  border-bottom: 1px solid #e1e1e1;
}
</style>
