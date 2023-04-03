<template>
  <el-menu v-bind="$attrs" ref="menu" @select="menuSelect">
    <slot name="head"></slot>
    <template v-for="item in items">
      <el-submenu v-if="item.children" :key="item.title" :index="item.title">
        <template v-slot:title>
          <i :class="item.icon" style="color: #ffffff"></i>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item v-for="item_c in item.children" :key="item_c.title" :index="item_c.path">
          <i :class="item_c.icon" style="color: #ffffff"></i>
          <template v-slot:title>
            <span>{{ item_c.title }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :key="item.title" :index="item.path">
        <i :class="item.icon" style="color: #ffffff"></i>
        <template v-slot:title>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <slot name="tail" style="float: right"></slot>
  </el-menu>
</template>

<script>
export default {
  name: "BaseMenu",
  props: {
    items: {type: Array, default: null},
  },
  methods: {
    menuSelect(index) {
      this.$emit('menu_select', index)
    }
  }
}
</script>

<style scoped>
</style>
