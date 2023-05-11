<template>
  <div class="ck-content" v-html="realContent"/>
</template>

<script>
import '@/assets/css/ck-content.css'
export default {
  name: "MyContent",
  props: {
    content: {type: String, default: ''}
  },
  computed: {
    realContent() {
      return this.content || ''
    }
  }
}
</script>

<style scoped>

</style>