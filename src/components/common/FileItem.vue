<template>
  <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="file-item" >
    <transition name="el-fade-in-linear">
      <div v-if="show_buttons" class="shadow">
        <el-tooltip class="item" effect="light" :content="`下载：${file.name}`" placement="bottom">
          <el-button type="text" style="color: #fff;font-size: 20px;" icon="el-icon-download" @click="clickDownload(file.url)"></el-button>
        </el-tooltip>
<!--        <el-tooltip class="item" effect="light" content="文件预览" placement="bottom">-->
<!--          <el-button type="text" style="color: #fff;font-size: 20px;" v-if="isDocument"  icon="el-icon-view" @click="openPreviewDialog"></el-button>-->
<!--        </el-tooltip>-->
      </div>
    </transition>

    <img class="file-icon" :src="img || require('@/assets/img/file.webp')" alt="file">
    <span class="file-title">{{file.name}}</span>
    <PreviewDialog ref="preview_dialog"></PreviewDialog>
  </div>

</template>

<script>
// import PreviewDialog from "@/components/backend/exam/answer/PreviewDialog.vue";
import {mapGetters} from "vuex";

export default {
  name: "FileItem",
  // components: {PreviewDialog},
  props: {
    file: {type: Object, default: null},
    img: {type: String, default: null}
  },
  computed: {
    ...mapGetters(['$const']),
    // isDocument() {
    //  return this.$const.UPLOADER_FILE_EXT_NAMES_DOCUMENT.indexOf(this.$helper.getFileExtName(this.file.name)) !== -1
    // }
  },
  data() {
    return {
      show_buttons: false
    }
  },
  methods: {
    openPreviewDialog() {
      this.$refs.preview_dialog.open(this.file)
    },
    handleMouseEnter() {
      this.show_buttons = true
    },
    handleMouseLeave() {
      this.show_buttons = false
    },
    clickDownload(url){
      window.open(url)
    },
  }
}
</script>

<style scoped>
.file-item:hover {
  transition: 0.3s;
  background-color: rgba(0, 0, 0, .5);
}

.file-item{
  margin-top: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  max-width: 320px;
  zoom: 1;
  user-select: none;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
.file-icon{
  width: 42px;
  height: 42px;
  overflow: hidden;
  margin-right: 14px;
  display: block;
  border-radius: 4px;
  float: left;
  margin-top: 0;
  margin-bottom: 0;
}
.file-title{
  min-height: 42px;
  line-height: 42px;

  vertical-align: middle;

}
.shadow {
  transition: 0.3s;
  width:100%;
  right: 0;
  text-align: center;
  position: absolute;
  z-index: 1;
  border-radius: 8px;
  backdrop-filter: blur(1px);
  /*background-color: transparent;*/
}

</style>
