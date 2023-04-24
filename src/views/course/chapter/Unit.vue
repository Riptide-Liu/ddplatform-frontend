<template>
  <el-card style="border-radius: 16px;min-height: calc(100vh - 100px);">
    <template v-slot:header>
      <el-page-header @back="$router.push(`/course/${courseId}`)" :content="unitItem.title">
      </el-page-header>

    </template>
    <div class="borderBox" v-if="unitItem.content">
      <span style="font-weight: bold">内容：</span>
      <div style="margin: 16px">
        {{unitItem.content}}
      </div>
    </div>
    <div style="font-weight: bold;margin-bottom: 16px">课件：</div>
    <div class="file-preview " v-if="unitItem.fileUrl">
      <embed style="height: 100%;width: 100%;" type="application/pdf" :src="unitItem.fileUrl" />
<!--      <XdocView v-if="unitItem"  src="http://rsaaqbr24.bkt.clouddn.com/基于springboot+vue的教学辅助平台刘华东.doc" />-->
    </div>
    <el-empty v-else description="暂无课件"></el-empty>


  </el-card>
</template>


<script>
// import XdocView from "@/components/common/XdocView.vue";
import * as unit_request from "@/api/admin/course/unit";
import {getFileUrl} from "@/api/file";
export default {
  name: "ChapterUnit",
  // components: {XdocView},
  computed: {
    unitId() {
      return this.$route.params.unit_id
    },
    courseId() {
      return this.$route.params.course_id
    },
    unitItem() {
      let item = this.unit_item
      if(!item)
        item = {}
      item.fileUrl = item.fileKey? getFileUrl(item.fileKey): null
      return item
    },
  },
  data() {
    return {
      unit_item: {},
    }
  },
  created() {
    this.getItem()
  },
  methods: {
    getItem() {
      unit_request.get(this.unitId).then(
          resp => {
            if(resp.code === 200){
              // for(let i in resp.data) {
              //   this.$set(this.unit_item, i, resp.data[i])
              // }
              this.unit_item = resp.data
            }

          }
      )
    }
  }
}
</script>

<style scoped>
.file-preview {
  width: 100%;
  height: 600px;
}

.borderBox{
  margin: 16px auto;
  padding: 10px 15px;
  border: 1px solid #F0F3F7;
  border-left: 5px solid #e1e7f0;
}
</style>
