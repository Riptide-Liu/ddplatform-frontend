<template>
  <div style="overflow: hidden">
    <div class="container">
      <div style="padding: 0">
        <transition enter-active-class="animate__animated animate__fadeInDown"
                    appear>
          <div class="i-banner">
            <div class="banner-content">
              <div class="banner-content-wrapper">
                <div class="wrapper-content">
                  <el-image :src="courseInfo.image" style="width: 320px;height: 200px"></el-image>
                  <div class="wrapper-content-right">
                    <el-tooltip effect="light" :content="courseInfo.name" placement="top">
                      <div class="title">
                        {{courseInfo.name}}
                      </div>
                    </el-tooltip>
                    <div class="description">
                      <el-scrollbar style="height: 130px;">
                        <Content :content="courseInfo.description"></Content>
                      </el-scrollbar>
                    </div>

                    <div class="content-footer" style="text-align: right;width: 100%">
                      <span>更新时间: {{ courseInfo.updateTime }}</span>
                      <span style="margin-left: 30px">创建时间: {{ courseInfo.createTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn" mode="out-in">
          <el-row v-if="show_name=== 'course'" :gutter="20">
            <el-col :span="17">
              <transition enter-active-class="animate__animated animate__fadeInUp"
                          appear >
                <ChapterList :scroll_view="current_chapter_name"
                             :chapters="chapter_items">
                </ChapterList>
              </transition>

            </el-col>
            <el-col :span="7">
              <transition enter-active-class="animate__animated animate__fadeInUp"
                          appear >
                <div :style="`top:${menu_top};border-radius: 16px;margin-top: 12px`" :class="change_menu_top?'menu':''">
                  <div class="vue-affix">
                    <div class="menu-inner">
                      <div class="menu-title">目录</div>
                      <template v-if="chapter_items && chapter_items.length">
                        <el-scrollbar class="menu-scrollbar">
                          <div v-for="item of chapter_items" :key="item.id"
                               @click="clickMenu(item)"
                               :class="current_chapter_name === item.name?'menu-item active':'menu-item'">
                            {{item.name}}
                          </div>

                        </el-scrollbar>
                      </template>
                      <el-empty v-else></el-empty>
                    </div>
                  </div>
                </div>

              </transition>

            </el-col>
          </el-row>
          <el-card shadow="hover" v-else-if="show_name==='attachment'" :body-style="{ padding: '16px' }" style="border-radius: 16px">
            <AttachmentList :table_data="attachment_items"
                            :page_data="{page, per_page, total}"
                            @page-changed="handlePageChange"></AttachmentList>
          </el-card>
        </transition>
      </div>
    </div>
  </div>

</template>

<script>
import ChapterList from "@/components/frontend/course/ChapterList";
import {CHANGE_MENUBAR, SHOW_TITLE} from "@/res/event-types";
import * as chapter_request from "@/api/admin/course/chapter";
import * as course_request from "@/api/course";
import {getFileUrl} from "@/api/file";
import Content from "@/components/common/Content.vue";


export default {
  name: "CourseItem",
  components: {Content, ChapterList},
  computed: {
    courseId() {
      return this.$route.params.course_id
    },
    courseInfo() {
      let item = this.$lodash.cloneDeep(this.course_item)
      if(!item)
        item = {}
      item.image = item.imageKey?getFileUrl(item.imageKey): require('@/assets/sign.png')
      item.createTime = this.$helper.parseTime(item.createTime)
      item.updateTime = this.$helper.parseTime(item.updateTime)
      return item;
    },
  },
  watch: {
    '$route'(nv, ov) {
      if (nv !== ov) {
        this.handleGetData()
      }
    }
  },
  data() {
    return {
      current_chapter_name:null,
      course_item: null,
      chapter_items: [],
      note_items: [],
      active_name: 'course',
      menu_top: 'auto',
      change_menu_top:false,
      total: 0,
      page: 1,
      per_page: 10,
      attachment_items:[],
      show_name: 'course',
    }
  },
  created() {
    this.handleGetData();
  },
  beforeDestroy() {
    this.$bus.$off('content-scroll',this.handleContentScroll)
    this.$bus.$emit(CHANGE_MENUBAR, false)
  },
  mounted() {
    this.$bus.$on('content-scroll',this.handleContentScroll)
  },
  methods: {
    handleContentScroll(content) {
      let scrollTop = content.scrollTop
      if (scrollTop >= 80) {
        this.$bus.$emit(CHANGE_MENUBAR, true)
        this.$bus.$emit(SHOW_TITLE, this.courseInfo.name || null)
      }else {
        this.$bus.$emit(CHANGE_MENUBAR, false)
        this.$bus.$emit(SHOW_TITLE, null)
      }
      if(scrollTop > 420 ){
        this.menu_top = '76px';
        this.change_menu_top = true
      }else{
        this.menu_top = 'auto';
        this.change_menu_top = false
      }
    },
    handleCourseSelect(index) {
      this.show_name = index
       if (index === 'attachment')
        this.getAttachmentList()

    },
    handlePageChange(params) {
      this.page = params.page
      this.per_page = params.per_page
      this.getAttachmentList()
    },
    getAttachmentList() {
      // 资源列表
    },
    handleGetData() {
      this.getChapterItems();
      this.getCourseItem();

    },
    clickMenu(item){
      this.current_chapter_name = item.name
    },
    windowScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // 176是页面滑动刚好看不到title的距离
      if(this.course_item){
        let title = scrollTop >= 176 ? this.course_item.name: null
        this.$bus.$emit(SHOW_TITLE, title)
      }
      if(scrollTop > 620 ){
        this.menu_top = '76px';
        this.change_menu_top = true
      }else{
        this.menu_top = 'auto';
        this.change_menu_top = false
      }
    },
    tabClick(tab) {
      let tab_menu = {
        back: () => this.$router.push('/'),
      }
      if(tab_menu[tab.name])
        tab_menu[tab.name]()
    },
    getCourseItem() {
      course_request.get(this.courseId).then(
          resp => {
            if(resp.code === 200)
              this.course_item = resp.data;
          })
    },
    getChapterItems() {
      chapter_request.list({course_id: this.courseId}).then(
          resp => {
            if(resp.code === 200)
              this.chapter_items = resp.data;
          }
      )
    },
    getLessonNoteItems() {
      this.$api.$request(this.$api.$doc.lesson_note.function.API_COURSE_LESSON_NOTE_ALL_BY_COURSE_COURSE_ID, {
        rest_args: {course_id: this.id},options: {feedback: false},
      }).then(
          resp => {
            this.note_items = resp.data.items;
          }
      )
    },
    handleNoteClick(note_id) {
      this.$refs.note_drawer.open(null, note_id, true)
    },
  }
}
</script>

<style scoped>
.vue-affix {
  position: relative;
}
.menu-inner {
  /*width: 340px;*/
  /*min-width: 340px;*/
  background: #fff;
  padding: 8px 0 32px 0;
  border-radius: 16px;
}

.menu-title {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  width: 260px;
  margin: 0 auto;
  border-bottom: 2px solid #409EFF;
}
.menu-item {
  height: 24px;
  margin:  16px 0 16px 0;
  padding: 0 40px 0 40px;
  position: relative;
  cursor: pointer;
  color: #333333;
  /*font-size: small;*/
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.active {
  color: #409EFF;
}
.menu {
  width: 357px;
  position: fixed;
  z-index: 1000;
  overflow-x: hidden;
}
.i-banner {
  height: 336px;
  overflow: hidden;
  position: relative;
}
.banner-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.banner-content-wrapper {
  margin: 0 auto;
  height: 100%;
}
.wrapper-content {
  position: relative;
  margin-top: 12px;
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 46px 40px;
}
.wrapper-content-right {
  margin-left: 40px;
  flex: 1;
  color: #ffffff;
  width: 840px;
  position: relative;
}
.title {
  font-size: 24px;
  line-height: 32px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #333333;
}
.description {
  /*margin-top: 30px;*/
  font-size: 14px;
  line-height: 22px;
  font-weight: normal;
  word-break: break-all;
  color: #666666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.description /deep/ .el-scrollbar__wrap{
  overflow-x: hidden;
}
.menu-scrollbar /deep/ .el-scrollbar__wrap{
  max-height: 58vh;
  overflow-x: hidden;
}
.content-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 14px;
  line-height: 22px;
  font-weight: normal;
  color: #666666;
}
.banner-img {
  width: 100%;
  height: 170px;
}
/*.description {*/
/*  padding: 0 16px;*/
/*  text-indent: 1rem;*/
/*  word-break : break-all;*/
/*  overflow: hidden;*/
/*  line-height: 20px;*/
/*  font-weight: normal;*/
/*}*/
.course-text {
  position: relative;
  color: white;
  top: -170px;
  width: 1024px;
  height: 170px;
  padding: 0;
  text-shadow: 2px 2px 2px black;
}

/deep/ .el-tabs__content {
  top: -12px;
  left: -12px;
  width: 100%;
  padding: 12px;
}


@media screen and (min-width: 1440px){
  .container {

    margin: 0 auto;
  }
}

@media screen and (max-width: 1440px){
  .container{
    padding: 20px;
  }
}

</style>
