<template>
  <div>
    <el-menu ref="menu" :class="change_menubar?'menubar-theme':''" default-active="none"
             mode="horizontal" @select="menuSelect">
      <el-menu-item class="title-item">
        <template v-slot:title>
          <transition name="el-fade-in">
            <div v-show="!title">
              <router-link :to="userInfo ? '/' : '#'" class="el-link" draggable="false">
                <span
                    :style="change_menubar?'font-size: x-large;color: #fff':'font-size: x-large;color: black'">DDPlatform</span>
                <!--            <img alt="Logo" class="logo" src="@/assets/img/common/logo.webp"/>-->
              </router-link>
            </div>
          </transition>
          <transition name="el-fade-in-linear">
            <div v-show="title">
              <div @click="handleClickTitle">
                <span
                    :style="change_menubar?'font-size: x-large;color: #fff':'font-size: x-large;color: black'">{{title}}</span>
              </div>
            </div>
          </transition>
        </template>
      </el-menu-item>
      <template v-if="userInfo">
        <el-submenu index="user" style="float: right;">
          <template v-slot:title>
            <el-avatar :src="avatarUrl"
                       size="small"></el-avatar>
            <span :style="change_menubar?'color: #fff':'color: black'">
              {{ userInfo.nickname ? userInfo.nickname : userInfo.username }}
            </span>
          </template>
          <el-menu-item index="/admin" v-if="isAdmin">
            <i class="el-icon-setting"></i> 管理后台
          </el-menu-item>
          <el-menu-item index="edit">
            <i class="el-icon-edit"></i> 用户信息
          </el-menu-item>
<!--          <el-menu-item index="change_password">-->
<!--            <i class="el-icon-key"></i> 修改密码-->
<!--          </el-menu-item>-->
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
    </el-menu>
    <ChangePasswordDialog ref="change_pwd_dialog"></ChangePasswordDialog>
    <EditDrawer v-if="userInfo" ref="edit_info" :user_info="userInfo"></EditDrawer>
  </div>
</template>

<script>
import {ROLE_TYPE_ADMIN, ROLE_TYPE_TEACHER} from "@/res/constant";
import {mapGetters} from "vuex";
import {CHANGE_MENUBAR, SHOW_TITLE} from "@/res/event-types";
import {getFileUrl} from "@/api/file";
import ChangePasswordDialog from "@/components/common/ChangePasswordDialog.vue";
import EditDrawer from "@/components/common/EditDrawer.vue";
export default {
  name: "FrontendHeader",
  components: {ChangePasswordDialog, EditDrawer},
  computed: {
    ...mapGetters([
      'userInfo',
      '$const',
    ]),
    isAdmin() {
      return [ROLE_TYPE_ADMIN, ROLE_TYPE_TEACHER].indexOf(this.userInfo.userType) !== -1;
    },
    avatarUrl() {
      return this.userInfo.avatar?getFileUrl(this.userInfo.avatar):null
    },
  },
  data() {
    return {
      title: null,
      categories: [],
      search: '',
      show_search: true,
      change_menubar: false
    };
  },
  created() {
    this.$bus.$on(SHOW_TITLE, this.showTitle)
    this.$bus.$on(CHANGE_MENUBAR, this.changeMenubar)
  },
  beforeDestroy() {
    this.$bus.$off(SHOW_TITLE)
    this.$bus.$off(CHANGE_MENUBAR)
    window.removeEventListener('scroll', this.windowScroll);
  },
  mounted() {
    window.addEventListener('scroll', this.windowScroll)
  },
  methods: {
    handleClickTitle() {
      window.scrollTo(0, 0)
    },
    showTitle(title) {
      this.title = title
    },
    changeMenubar(change) {
      this.change_menubar = change
    },
    windowScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.change_menubar = scrollTop > 50
    },

    menuSelect(index) {
      if (index === 'edit') {
        this.$refs.edit_info.open();
      } else if (index === 'change_password') {
        this.$refs.change_pwd_dialog.open();
      } else if (index === 'logout') {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push('/user/login');
            })
      } else if (String(index).startsWith('/')) {
        this.$router.push(index);
      } else {
        this.$refs.menu.activeIndex = '';
      }
    },
  },
  watch: {
    routePath(nv) {
      this.$refs.menu.activeIndex = nv
    }
  }
}
</script>

<style scoped>
/deep/ .el-fade-in-leave-active {
  display: none;
}
/deep/ .el-fade-in-linear-leave-active {
  display: none;
}
.title-item {
  text-align: center;
}
/deep/ .el-submenu.is-active .el-submenu__title {
  border-bottom: 0;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 0;
}
.menubar-theme {
  color: white;
  background-color: #409EFF;
  border-bottom: none;
  box-shadow: 0 0 6px rgb(0 0 0 / 40%);
}
/deep/ .search .el-input__inner {
  background-color: white !important;
  border-color: white !important;
  border-bottom-color: #8c939d !important;
  /*border-radius: 0 !important;*/
  /*color: #d9d9d9 !important;*/
}
.el-menu-item {
  background-color: rgba(255, 255, 255, 0) !important;
}
.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0) !important;
}
/deep/ .el-submenu__title:hover {
  background-color: rgba(255, 255, 255, 0) !important;
}
/deep/ .el-avatar img {
  width: 100%;
  object-fit: cover;
}
</style>
