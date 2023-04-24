<template>
  <el-container>
    <el-header class="header">
      <Header></Header>
    </el-header>
    <el-container class="content">
      <el-aside width="200px">
        <LeftMenu :menu_items="routes"></LeftMenu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/admin/common/Header.vue";
import LeftMenu from "@/components/admin/common/LeftMenu.vue";

export default {
  name: "AdminIndex",
  components: {Header, LeftMenu},
  data() {
    return {
      routes: [
        {path: '/admin/user', title: '用户管理', icon: 'el-icon-user', roles:[]},
        {path: '/admin/class', title: '班级管理', icon: 'el-icon-school', roles:[]},
        // {
        //   title: '教学模块', icon: 'el-icon-menu',
        //   roles:[],
        //   children: [
        //     {path: '/admin/class/schedule/calendar', title: '课程计划', icon: 'el-icon-date',
        //       roles:[]},
        //     {path: '/admin/class', title: '班级管理', icon: 'el-icon-school',
        //       roles:[]},
        //     {path: '/admin/class/student', title: '学生管理', icon: 'el-icon-user',
        //       roles:[]},
        //     {path: '/admin/class/homework', title: '作业管理', icon: 'el-icon-notebook-2',
        //       roles:[]},
        //     {path: '/admin/homework/record', title: '作业记录管理', icon: 'el-icon-notebook-1',
        //       roles:[]},
        //     {path: '/admin/exam/online/class', title: '考试管理', icon: 'el-icon-medal-1',
        //       roles:[]},
        //     {path: '/admin/exam/answer', title: '答案管理', icon: 'el-icon-s-check',
        //       roles:[]},
        //   ]
        // },
        {path: '/admin/course', title: '课程管理', icon: 'el-icon-s-order',}
        // {
        //   title: '课程模块', icon: 'el-icon-menu',
        //   children: [
        //     {path: '/admin/course', title: '课程管理', icon: 'el-icon-s-order',},
        //     // {path: '/admin/course/resource', title: '课程资源管理', icon: 'el-icon-document',},
        //   ]
        // },
        // {path: '/admin', title: '系统状态', icon: 'el-icon-warning-outline',
        //   roles:[]},
      ],
    }
  }
}
</script>

<style scoped>
.header {
  padding: 0;
}
.content {
  /* - Header + border */
  height: calc(100vh - 60px);
}
</style>
