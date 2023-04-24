<template>
  <div >
    <el-card :id="chapter.name" v-for="chapter in chaptersData" :key="chapter.id"
             shadow="hover" :getEmulateTestExercises-style="{ padding: '16px' }" style="margin-bottom: 12px;border-radius: 16px ">
      <div class="chapter-name" @click="showLessons(chapter)">
        <el-icon class="el-icon-files"></el-icon>
        <span style="padding-left: 8px;">{{ chapter.name }}</span>
        <i style="float: right" :class="chapter.show?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
      </div>
      <el-collapse-transition>
        <div v-show="chapter.show">
          <div v-for="lesson in chapterLessons(chapter)" :key="lesson.id" style="font-size: 15px;padding: 5px;">
            <router-link :to="`/course/${courseId}/unit/${lesson.id}`" >
              <div class="el-tree-node__content" style="display: block; color: #606266;">
                <div class="item">
                  <div class="item-title">
                    <template v-if="lesson.progress">
                      <span style="margin-right: 4px;">
                        <i v-if="lesson.progress >= 1" style="color: green" class="el-icon-success"></i>
                        <i v-else class="el-icon-success"></i>
                      </span>
                    </template>
                    <i v-else class="el-icon-circle-check" style="margin-right: 4px;"></i>
                    <span  style="font-size: 13px;">{{ lesson.title }}</span>
                  </div>
                  <div>
                    <el-tag
                        :type="lesson.environments_num?'warning':'success'"
                        size="mini"
                        effect="dark">
                      {{lesson.environments_num?'实操':'理论'}}
                    </el-tag>
                    <!--                    <template v-if="lesson.progress">-->
                    <!--                      <i v-if="lesson.progress >= 1" style="color: green" class="el-icon-circle-check"></i>-->
                    <!--                      <i v-else class="el-icon-warning-outline"></i>-->
                    <!--                    </template>-->
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </el-collapse-transition>
    </el-card>

    <el-card v-if="chaptersAllEmpty" shadow="hover">
      <el-empty></el-empty>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "ChapterList",
  props: {
    chapters: {type: Array, default: null},
    scroll_view: {type: String, default: null}
  },
  watch: {
    scroll_view(nv) {
      if(nv)
        location.href = `#${nv}`;
    }
  },
  computed: {
    courseId() {
      return this.$route.params.course_id
    },
    chaptersAllEmpty() {
      if(!this.chapters) return true
      for (let chapter of this.chapters)
        if (!this.isChapterEmpty(chapter))
          return false
      return true
    },
    chaptersData(){
      let chapters = this.$lodash.cloneDeep(this.chapters)
      if(!chapters)
        chapters = []
      for(let chapter of chapters){
        chapter.show = true;
      }
      return chapters
    },
    chapterLessons() {
      return chapter => {
        let lessons = this.$lodash.cloneDeep(chapter.unit)
        if(!lessons)
          lessons = []
        return lessons
      }
    }
  },
  updated() {
    if(this.$route.hash){
      let name = decodeURI(this.$route.hash).slice(1)
      if(document.getElementById(name))
        document.getElementById(name).scrollIntoView();
    }
  },
  methods: {
    showLessons(item){
      item.show = !item.show
      this.$forceUpdate()
    },
    isChapterEmpty(chapter) {
      return !chapter.unit.length
    },
  }
}
</script>

<style scoped>
  .chapter-name {
    font-size: 18px;
    font-weight: bold;
    margin: 8px 12px;
  }
  .item {
    padding: 4px 8px;
    justify-content: space-between;
    display: flex;
  }
  .item-title {
    text-indent: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden
  }
</style>
