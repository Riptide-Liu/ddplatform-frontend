<template>
  <el-upload
      :class="picture_mode?'avatar-uploader':''"
      :action="uploadAction"
      :headers="{token}"
      :show-file-list="!picture_mode"
      v-bind="$attrs"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload">
    <template v-if="picture_mode">
      <img v-if="picture_url" :src="picture_url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </template>
    <template v-else>
      <el-button size="small" type="primary">点击上传</el-button>
    </template>
  </el-upload>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "FileUpload",
  props: {
    picture_mode: {type: Boolean, default: false},
    picture_url: {type: String, default: null},
    pdf_mode: {type: Boolean, default: false},
    file_list: {type: Array, default: null},
  },
  computed: {
    ...mapGetters(['token', 'uploadAction']),
  },
  methods: {
    beforeUpload(file) {
      if(this.picture_mode)
        return this.beforeAvatarUpload(file)
      else if (this.pdf_mode)
        return this.beforePdfUpload(file)
      else return  true
    },
    beforePdfUpload(file) {
      const isPDF = file.type === 'application/pdf';

      if (!isPDF) {
        this.$message.error('上传文档只能是 PDF 格式!');
      }

      return isPDF;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG || !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return (isJPG || isPNG) && isLt3M;
    },
    handleUploadSuccess(res) {
      this.$emit('upload-success', res)
    },
  }
}
</script>

<style scoped>
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
