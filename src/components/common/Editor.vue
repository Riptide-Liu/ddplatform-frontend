<template>
  <div>
    <CKEditor
        v-model="internal_value"
        :editor="editor"
        :config="config"
        :disabled="disabled"
        ref="editor"
        @input="handleInput"
    />
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'


export default {
  name: "MyEditor",
  components: {CKEditor: CKEditor.component},
  props: {
    value: {type: String, default: ''},
    placeholder: String,
    disabled: Boolean,
  },
  computed: {
    realValue() {
      return this.value || ''
    },
    fixedValue() {
      return this.internal_value
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      config: {
        language: 'zh-cn',
        placeholder: this.placeholder,
      },
      internal_value: '',
    }
  },
  created() {
    this.internal_value = this.realValue
  },
  mounted() {
    for (let event of ['ready', 'focus', 'blur', 'destroy'])
      this.$refs.editor.$on(event, (...x) => {
        this.$emit(event, ...x)
      })
  },
  methods: {
    handleInput() {
      if (this.value !== this.fixedValue)
        this.$emit('input', this.fixedValue)
    }
  },
  watch: {
    value(nv, ov) {
      if (nv !== ov)
        this.internal_value = this.realValue
    }
  },
}
</script>

<style scoped>
/deep/ .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
  min-height: 128px;
  max-height: 600px;
}

</style>
