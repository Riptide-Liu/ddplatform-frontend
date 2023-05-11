<template>
  <div>
 
    <el-card style="border-radius: 16px;min-height: calc(100vh - 100px);">
      <template v-slot:header>
        <div>
          <div>
            <el-page-header @back="$router.push(`/course/${courseId}`)">
              <template v-slot:content>
                <span style="font-weight: bold;font-size: 22px">{{ unitItem.title }}</span>
              </template>
            </el-page-header>
        
          </div>
          <div style="font-size: 14px;color: gray;margin-top: 12px">
            <span>更新时间：{{ unitItem.updateTime }}</span>
            <span style="margin-left: 20px;">创建时间：{{ unitItem.createTime }}</span>
          </div>
        </div>
      </template>
      <div v-if="unitItem.content">
        <Content :content="unitItem.content"></Content>
      </div>
      <div style="margin-bottom: 16px"></div>
      <div class="file-preview " v-if="unitItem.fileUrl">
        <embed style="height: 100%;width: 100%;" type="application/pdf" :src="unitItem.fileUrl" />
      </div>

    </el-card>
  </div>
 
</template>


<script>
import * as unit_request from "@/api/admin/course/unit";
import {getFileUrl} from "@/api/file";
import {HIDE_ASIDE, SHOW_TITLE} from "@/res/event-types";
import Content from "@/components/common/Content.vue";
export default {
  name: "ChapterUnit",
  components: {Content},
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
      item.createTime = this.$helper.parseTime(item.createTime)
      item.updateTime = this.$helper.parseTime(item.updateTime)
      return item
    },
  },
  data() {
    return {
      unit_item: {},
    }
  },
  created() {
    this.$bus.$emit(HIDE_ASIDE, true)
    this.getItem()
  },
  beforeDestroy() {
    this.$bus.$emit(HIDE_ASIDE, false)
    this.$bus.$emit(SHOW_TITLE, null)
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
