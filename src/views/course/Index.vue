<template>
  <el-container style="height: calc(100vh - 60px);">
    <transition enter-active-class="animate__animated animate__fadeInLeft" appear>
      <CourseAside v-if="course_item" :item="course_item" style="height: 100%"></CourseAside>
    </transition>
    <div ref="content_box" @scroll="contentScroll" style="overflow: auto;width: 100%">
      <el-main>
        <transition enter-active-class="animate__animated animate__fadeIn"
                    mode="out-in"
                    appear
                    appear-active-class="animate__animated animate__fadeInUp"
                    :duration="{enter: 1000, leave: 100}"
                    leave-active-class="animate__animated animate__fadeOut">
          <router-view></router-view>
        </transition>
      </el-main>
    </div>

  </el-container>

</template>

<script>
// import {CHANGE_MENUBAR} from "@/res/event-types";
import CourseAside from "@/components/frontend/course/Aside.vue";
import * as course_request from "@/api/course";
export default {
  name: "CourseIndex",
  components:{CourseAside},
  computed: {
    courseId() {
      return this.$route.params.course_id
    },
  },
  data() {
    return {
      items: null,
      total: 0,
      page: 1,
      per_page: 10,
      course_item: null
    }
  },
  created() {
    // this.$bus.$emit(CHANGE_MENUBAR, true)
    this.getCourseItem();
  },
  beforeDestroy() {
    // this.$bus.$emit(CHANGE_MENUBAR, false)
  },
  methods: {
    contentScroll() {
      this.$bus.$emit('content-scroll', this.$refs.content_box)
    },
    getCourseItem() {
      course_request.get(this.courseId).then(
          resp => {
            if(resp.code === 200)
              this.course_item = resp.data;
          })
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
.bank-image {
  width: 60px;
}
.bank-card {
  margin: 16px;
  display: inline-block;
  border-radius: 16px;
  width: 450px;
  height: 120px;
  text-align: center;
  border: 0;
}

</style>
