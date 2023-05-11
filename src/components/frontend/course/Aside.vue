<template>
  <el-aside width="224px">
    <el-menu :default-active="`${$route.path}`" ref="menu" @select="menuSelect" style="height: 100%">
      <div class="class-info">
        <div @mouseenter="show_back = true" @mouseleave="show_back = false" class="banner-content">
          <transition enter-active-class="animate__animated animate__fadeIn"
                      leave-active-class="animate__animated animate__fadeOut">
            <div class="banner-shadow" v-show="show_back" @click="goBack">
              <el-icon class="el-icon-s-home"></el-icon>
            </div>
          </transition>
          <el-image :src="itemData.banner" class="banner" fit="contain">
          </el-image>
        </div>
        <div class="class-text">{{ itemData.name }}</div>
      </div>
      <el-menu-item v-for="(item, index) of itemData.menu" :key="index" :index="item.index">
        <i :class="item.icon"></i>
        <template v-slot:title>{{ item.label }}</template>
      </el-menu-item>

    </el-menu>
  </el-aside>
</template>

<script>
import {getFileUrl} from "@/api/file";

export default {
  name: "CourseAside",
  props: {
    item: {type: Object, default: null}
  },
  computed: {
    itemData() {
      let item = this.$lodash.cloneDeep(this.item)
      if (!item)
        item = {}
      if (item.id)
        item.menu = [
          {index: `/course/${item.id}`, label: '课程内容', icon: 'el-icon-reading'},
          // {index: `/course/${item.id}/sign`, label: '签到', icon: 'el-icon-s-check'},
          {index: `/course/${item.id}/resource`, label: '课程资源', icon: 'el-icon-receiving'},
          {index: `/course/${item.id}/student`, label: '我的同学', icon: 'el-icon-s-custom'},
          // {index: `/course/${item.id}/homework`, label: '我的作业', icon: 'el-icon-s-management'},
        ]
      item.banner = item.imageKey?getFileUrl(item.imageKey):require('@/assets/sign.png')
      item.name = item.name || '（无名称）'
      return item
    }
  },
  data() {
    return {
      show_back: false
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    menuSelect(index) {
      if (String(index).startsWith('/')) {
        this.$router.push(index);
      } else {
        this.$refs.menu.activeIndex = '';
      }
    },
  },
}
</script>

<style scoped>
.class-info {
  width: 180px;
  margin: 30px auto 12px auto;
}

.banner {
  width: 180px;
  height: 78px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;

}

.banner-content {
  height: 78px;
  width: 100%;
  cursor: pointer;
  position: relative;
  --animate-duration: 0.66s;
}


.banner-shadow {
  --animate-duration: 0.66s;
  display: inline-block;
  width: 180px;
  height: 78px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  line-height: 78px;
  font-size: 20px;
  color: #fff;
  z-index: 1;
  border-radius: 6px;
}

.class-text {
  font-size: 16px;
  text-align: center;
  width: 100%;
  line-height: 21px;
  margin-top: 12px;
}
</style>
