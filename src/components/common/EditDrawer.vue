<template>
  <el-drawer
      title="用户信息"
      :append-to-body='true'
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
    <el-form :model="item" label-width="100px" style="margin-right: 16px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
            v-model="item.nickName"
            placeholder="请输入用户昵称"
            maxlength="30"
        />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="item.sex" placeholder="请选择">
          <el-option :key="'0'" label="男" :value="0" />
          <el-option :key="'1'" label="女" :value="1" />
          <el-option :key="'2'" label="未知" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像上传">
        <FileUpload picture_mode :picture_url="avatarUrl" @remove-file="item.avatar = null" @upload-success="handleAvatarSuccess"></FileUpload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editUser">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
  import FileUpload from "@/components/common/FileUpload.vue";
  import {getFileUrl} from "@/api/file";
  import * as user_request from "@/api/admin/user";

  export default {
    name: "EditDrawer",
    components: {FileUpload},
    props: {
      user_info: {type: Object, default: null}
    },
    computed:{
      avatarUrl() {
        return this.item.avatar?getFileUrl(this.item.avatar):null
      },
    },
    data() {
      return {
        item: {},
        drawer: false,
      };
    },
    methods:{
      open(){
        this.item = this.user_info || {}
        this.drawer = true
      },
      handleAvatarSuccess(resp) {
        this.$set(this.item, 'avatar', resp.data)
      },
      editUser() {
        if (this.item.id !== undefined) {
          this.item.password = null
          user_request.editUser(this.item).then(() => {
            this.$modal.msgSuccess('修改成功')
            this.drawer = false;
          })
        }
      },
      handleClose(done) {
        this.$store.dispatch('getInfo')
        done();
      }
    }
  }
</script>

<style scoped>
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  /deep/ .avatar-uploader .el-upload:hover {
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