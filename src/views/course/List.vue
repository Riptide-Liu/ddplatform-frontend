<template>
  <div class="course-content">
    <div style=" min-height: calc(100vh - 140px)">
      <div v-if="courses && courses.length" class="course-area">
        <div v-for="(item, index) in courses" @mouseenter="handleMouseEnter(item)" @mouseleave="handleMouseLeave(item)" style="margin: 12px" :key="index">
          <transition
              enter-active-class="animate__animated animate__zoomIn"
              appear>
            <div style="border-radius: 16px;"
                 class="course-card">
              <router-link :to="`/course/${item.id}`">
                <div class="pic">
                  <div class="shadow"></div>
                  <div class="course-image">
                    <el-image :src="item.image" alt="Course Image" style="height: 100%;width: 100%;" fit="contain">
                      <template v-slot:error>
                        <div class="image-slot" style="height: 144px;text-align: center;margin-top: 60px">
                          <i class="el-icon-picture-outline" style="font-size: 30px"></i></div>
                      </template>
                    </el-image>
                  </div>
                </div>
                <div class="content">
                  <div class="float">
                    <div class="course-title"> {{ item.name }}</div>
                    <el-collapse-transition>
                      <div v-show="item.show">
                        <div class="course-description">
                          <Content :content="item.course.description"></Content>
                        </div>
                      </div>
                    </el-collapse-transition>
                    <div class="course-footer">
                      <div style="font-size: 14px; color: #909399">
                        <div>开始时间：{{item.startTime}}</div>
                        <div>结束时间：{{item.endTime}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </transition>
        </div>
      </div>
      <el-empty v-else></el-empty>
    </div>
    <el-footer style="margin-top: 16px;">
      <el-pagination
          :current-page.sync="page_num"
          :page-size.sync="page_size" :page-sizes="[12, 24, 60, 120]"
          :total="total" background layout="total, prev, pager, next, sizes"
          @size-change="handlePageChange" @current-change="handlePageChange"></el-pagination>
    </el-footer>
  </div>
</template>

<script>
import {getFileUrl} from "@/api/file";
import * as course_request from "@/api/course";
import {SHOW_TITLE} from "@/res/event-types";
import Content from "@/components/common/Content.vue";
export default {
  name: "CourseIndex",
  components: {Content},
  computed: {
    courses() {
      let result = []
      if(this.items && this.items.length)
        for (let _item of this.items) {
          let item = this.$lodash.cloneDeep(_item)
          item.image = item.course.imageKey? getFileUrl(item.course.imageKey): require('@/assets/sign.png');
          item.id = item.course.id
          item.name = item.course.name
          item.startTime = this.$helper.parseTime(item.startTime);
          item.endTime = this.$helper.parseTime(item.endTime);
          result.push(item)
        }

      return result;
    },

  },
  data() {
    return {
      page_size: 12,
      page_num: 1,
      total: 0,
      query_value: '',
      items: []
    }
  },
  watch:{
    $route() {
      this.getCourseItems();
    },
  },
  created() {
    this.getCourseItems();
  },
  beforeDestroy() {
    this.$bus.$emit(SHOW_TITLE, null)
  },
  methods: {
    handleMouseEnter(item) {
      item.show = true
      this.$forceUpdate()
    },
    handleMouseLeave(item) {
      item.show = false
      this.$forceUpdate()
    },
    handlePageChange(){
      this.getCourseItems()
    },
    getCourseItems() {
      course_request.list({
        class_id: this.classId,
        page_size: this.page_size,
        page_num: this.page_num,
        query_value: this.query_value
      }).then((resp) => {
        if (resp.code === 200) {
          this.items = resp.data.items
          this.$bus.$emit(SHOW_TITLE, resp.data.class_info && resp.data.class_info.name)
          this.total = resp.data.total || 0
          this.page_size = resp.data.pageSize || 12
          this.page_num = resp.data.pageNum || 1
        }

      })
    },
  },
}
</script>

<style scoped>
.course-area {
  /*display: grid;*/
  /*grid-template-columns: repeat(4, 25%);*/
  display: flex;
  flex-wrap: wrap;

  /*grid-template-rows: repeat(3, 360px);*/
}
.pic{
  background-color: white;
  border-radius: 16px 16px 0 0;
  width: 100%;
  position: relative;
}

.content{
  width: 100%;
  height: 106px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}
.float{
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.course-card {
  border-radius: 16px;
  width: 320px;
  height: max-content;
  margin-bottom: 16px;
  margin-right: auto;
  --animate-duration: 0.66s;
}

.course-image {
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  width: 100%;
  max-height: 150px;
}

.course-title {
  padding-left: 16px;
  padding-top: 12px;
  font-size: 20px;
  padding-bottom: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.course-card:hover .course-title{
  color: #409EFF;
  transition: 0.6s;
  text-overflow: unset;
  white-space: normal;
}

.course-description {
  color: gray;
  padding: 0 16px;
  height: 60px;
  text-indent: 1rem;
  word-break : break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 12px;
  line-height: 20px;
  font-weight: normal;
}

.course-card:hover .float{
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
}

.course-card:hover .el-image{
  width: 110% !important;
  height: 110% !important;
  transition: 0.3s;
  transform: translate(-5%, -5%);
}
.course-card:hover .shadow{
  background-color: rgba(0, 0, 0, 0.3);
}

.shadow{
  transition: 0.3s;
  width: 100%;
  height: 150px;
  position: absolute;
  z-index: 1;
  border-radius: 16px 16px 0 0;
  background-color: transparent;
}
.course-card:hover .course-description {
  height: 60px !important;
}

.course-footer {
  padding: 16px;
}

.course-card:hover {
  --animate-duration: 0.33s;
}


@media screen and (min-width: 1440px){
  .course-content{
    margin: 0 auto;
    width: 1380px;
  }
}

@media screen and (max-width: 1440px){
  .course-card {
    width: 280px;
  }
}
</style>
