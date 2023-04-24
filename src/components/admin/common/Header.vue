<template>
  <div>
    <BaseMenu ref="menu"
              background-color="#363636" mode="horizontal"
              active-text-color="#ffffff" text-color="#ffffff"
              @menu_select="menuSelect">
      <template v-slot:head>
        <el-menu-item class="title-item" :index="userInfo ? '/' : '#'">
          <template v-slot:title>
<!--            <img v-if="platformLogo" alt="Logo" class="logo" :src="platformLogo"/>-->
            <span style="font-size: x-large">DDPlatform</span>
          </template>
        </el-menu-item>
      </template>
      <template v-slot:tail>
        <template v-if="userInfo">
          <el-submenu index="user" style="float: right;">
            <template v-slot:title>
              <el-avatar :src="avatarUrl"
                         size="small"
              ></el-avatar>
              {{ userInfo.nickname ? userInfo.nickname : userInfo.username }}
            </template>
<!--            <el-menu-item index="edit">-->
<!--              <i class="el-icon-edit"></i> 用户信息-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="change_password">-->
<!--              <i class="el-icon-key"></i> 修改密码-->
<!--            </el-menu-item>-->
            <el-menu-item index="logout">
              <i class="el-icon-switch-button"></i> 注销
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item index="/user/login" style="float: right;">
            <i class="el-icon-user"></i> 登录
          </el-menu-item>
        </template>
      </template>
    </BaseMenu>
<!--    <ChangePasswordDialog ref="change_pwd_dialog"></ChangePasswordDialog>-->
<!--    <EditDrawer v-if="userInfo" ref="edit_info" :user_info="userInfo"></EditDrawer>-->
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import BaseMenu from "@/components/admin/common/BaseMenu.vue";
import {getFileUrl} from "@/api/file";

export default {
  name: "AdminHeader",
  components: {BaseMenu},
  computed: {
    ...mapGetters(['userInfo']),
    avatarUrl() {
      return this.userInfo.avatar?getFileUrl(this.userInfo.avatar):null
    },
  },
  methods: {
    menuSelect(index) {
      if (index === 'edit') {
        this.$refs.edit_info.open();
      } else if (index === 'change_password') {
        this.$refs.change_pwd_dialog.open();
        this.$refs.menu.activeIndex = '';
      } else if (index === 'logout') {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push('/user/login');
        })
      } else if (String(index).startsWith('/')) {
        this.$router.push(index);
      }
    },
  }
}
</script>

<style scoped>
.title-item {
  text-align: center;
}
/deep/ .el-submenu.is-active .el-submenu__title{
  border-bottom: 0;
}
/deep/ .el-menu-item.is-active {
  border-bottom: 0;
}
.logo {
  height: 32px;
  margin-right: 8px;
}
/deep/ .el-avatar img {
  width: 100%;
  object-fit: cover;
}
.my-menu /deep/  .el-menu--horizontal>.el-menu-item.is-active{
  /*background-color: var(--color-light-2) !important;*/
  /*border-bottom-color: var(--color-shade-1) !important;*/
}
</style>
