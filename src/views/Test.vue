<template>
  <div>
    userInfo: {{userInfo}}
    <el-upload
        class="upload-demo"
        action="http://localhost:8081/file/upload"
        :headers="{token}"
        multiple
        :limit="3">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    token:{{token}}
    <el-button @click="getList">用户信息</el-button>
    <div>
      <el-button @click="logout">登出</el-button>
    </div>
  </div>

</template>

<script>
import {listUser} from "@/api/system/user";
import { mapGetters } from 'vuex'

export default {
  name: "MyTest",
  computed: {
    ...mapGetters(['userInfo', 'roles', 'token'])
  },
  data() {
    return {
      items: null,
    }
  },
  created() {

  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut')
    },
    getList() {
      listUser({pageSize:10,page_num:1}).then((response) => {
        this.items = response.data
      })
    },
  }
}
</script>

<style scoped>

</style>
