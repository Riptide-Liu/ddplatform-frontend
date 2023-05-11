<template>
<el-card>
  <template v-slot:header>课程资源</template>
  <div v-if="resourceItems && resourceItems.length" style="min-height: 570px;display: flex;flex-wrap: wrap">
    <div v-for="resource of resourceItems" :key="resource.id">
      <FileItem :file="resource"></FileItem>
    </div>
  </div>
  <el-empty v-else></el-empty>
</el-card>
</template>

<script>
import * as course_request from "@/api/course";
import FileItem from "@/components/common/FileItem.vue";
import {getFileUrl} from "@/api/file";
export default {
  name: "CourseResource",
  components: {FileItem},
  computed: {
    courseId() {
      return this.$route.params.course_id
    },
    resourceItems() {
      let items = this.$lodash.cloneDeep(this.items)
      if(!items)
        items = []
      for(let item of items) {
        item.url = getFileUrl(item.fileKey)
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
    this.getResourceItems()
  },
  methods: {
    getResourceItems() {
      course_request.getResources(this.courseId).then(
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

</style>
