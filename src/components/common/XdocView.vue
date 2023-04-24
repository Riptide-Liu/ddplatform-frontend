<template>
  <iframe :src="xsrc" frameborder="0" scrolling="auto" style="width:100%;height:100%;"></iframe>
</template>

<script>
export default {
  name: "XdocView",
  data() {
    return {
      xsrc:""
    };
  },
  props: {
    src: String,
    watermark: String,
  },
  watch: {
    src: {
      handler() {
        this.genXsrc();
      },
      immediate: true
    },
    watermark: {
      handler() {
        this.genXsrc();
      },
      immediate: true
    }
  },
  methods: {
    genXsrc() {
      if (this.src) {
        //你的文档地址
        var file = this.src;
        //XDOC文档预览服务地址
        var xurl = "https://view.xdocin.com/view?src=";
        //传入文档地址
        xurl += encodeURIComponent(file);
        //预览参数
        var ops = {
          "watermark": this.watermark,
          // "pdf": true, //word文档尝试以pdf方式显示，默认false
          // "saveable": true, //是否允许保存源文件，默认false
          // "printable": false, //是否允许打印，默认true
          // "copyable": false, //是否允许选择复制内容，默认true
          // "toolbar": false, //是否显示底部工具条，默认true
          // "expire": 30, //预览链接有效期，单位分钟，默认永久有效
          // "limit": "1,3", //限制页数，如：“5”表示只显示前5页，“2,5”表示从第2页开始的5页，对pdf/doc/docx/ppt/pptx有效
          // "mtime": 1633093801, //文件修改时间戳（精确到秒）或修改时间（如：2021-10-01 21:10:01），值改变刷新缓存，实时预览
        };
        //传入预览参数
        for (var a in ops) {
          if (ops[a] != undefined) {
            xurl += "&" + a + "=" + encodeURIComponent(ops[a]);
          }
        }
        //开始预览
        this.xsrc = xurl;
      }
    }
  },
}
</script>

<style scoped>

</style>
