<template>
  <el-container style="height: calc(100vh - 60px);">
    <transition enter-active-class="animate__animated animate__fadeInLeft" appear>
      <CourseAside v-if="course_item && !hide_aside" :item="course_item" style="height: 100%"></CourseAside>
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
import CourseAside from "@/components/frontend/course/Aside.vue";
import * as course_request from "@/api/course";
import {CHANGE_MENUBAR, HIDE_ASIDE, SHOW_TITLE} from "@/res/event-types";
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
      course_item: null,
      hide_aside: false,
    }
  },
  created() {
   this.$bus.$on(HIDE_ASIDE, (arg) => this.hide_aside = arg)
    this.getCourseItem();
  },
  beforeDestroy() {
    this.$bus.$emit(CHANGE_MENUBAR, false)
    this.$bus.$emit(SHOW_TITLE, null)
    this.$bus.$off(HIDE_ASIDE)
  },
  methods: {
    contentScroll() {
      this.$bus.$emit('content-scroll', this.$refs.content_box)
      this.handleContentScroll(this.$refs.content_box)
    },
    handleContentScroll(content) {
      let scrollTop = content.scrollTop
      if (scrollTop >= 40) {
        this.$bus.$emit(CHANGE_MENUBAR, true)
        // this.$bus.$emit(SHOW_TITLE, 123)
      }else {
        this.$bus.$emit(CHANGE_MENUBAR, false)
        // this.$bus.$emit(SHOW_TITLE, null)
      }
      if(scrollTop > 420 ){
        this.menu_top = '76px';
        this.change_menu_top = true
      }else{
        this.menu_top = 'auto';
        this.change_menu_top = false
      }
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
