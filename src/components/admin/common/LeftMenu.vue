<template>
  <div style="height: 100%">
    <BaseMenu ref="menu"
              style="height: 100%"
              background-color="#545c64"
              router
               text-color="#fff" :default-active="$route.path"
              :items="menu_items">
    </BaseMenu>
  </div>
</template>

<script>
import BaseMenu from "@/components/admin/common/BaseMenu.vue";
export default {
  name: "LeftMenu",
  components: {BaseMenu},
  props: {
    menu_items: {type: Array, default: null}
  },
}
</script>

<style scoped>
</style>
