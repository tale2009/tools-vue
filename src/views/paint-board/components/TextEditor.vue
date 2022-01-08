<template>
  <div v-if="form.type === 'text' && form.editing" class="text-editor" :style="editorStyle">
    <textarea
      ref="textarea"
      v-model="form.editText"
      rows="5"
      cols="50"
      placeholder="请输入内容"
      :style="textareaStyle"
    />

    <el-space class="text-operate" :size="5">
      <el-select v-model="form.editFontSize" style="width: 90px" size="small">
        <el-option v-for="item in fontSizeList" :label="`${item} px`" :value="item" />
      </el-select>
      <el-button plain size="small" @click="cancelInput">取消</el-button>
      <el-button type="primary" size="small" @click="confirmInput">完成</el-button>
    </el-space>
  </div>
</template>

<script>
  export default {
    name: 'TextEditor',
    props: ['form', 'context'],
    data() {
      return {
        fontSizeList: [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72],
      };
    },
    methods: {
      cancelInput() {
        this.form.editing = false;
        this.form.editText = '';
      },
      confirmInput() {
        const textList = this.form.editText.split('\n');
        const borderWidth = 1;
        const lineHeight = 1.5;
        const padding = 5;
        const fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';

        this.$emit('confirm');
        this.context.beginPath();
        this.context.fillStyle = this.form.color;
        this.context.textBaseline = 'top';
        this.context.font = `${this.form.editFontSize}px ${fontFamily}`;
        textList.forEach((text, index) => {
          const x = this.form.editPosition.x + borderWidth + padding;
          const y = this.form.editPosition.y + (index + (lineHeight - 1) / 2) * this.form.editFontSize * lineHeight + padding;
          this.context.fillText(text, x, y);
        });
        this.context.closePath();
        this.cancelInput();
      },
    },
    computed: {
      editorStyle() {
        return {
          left: `${this.form.editPosition.x}px`,
          top: `${this.form.editPosition.y}px`,
        };
      },
      textareaStyle() {
        return {
          color: this.form.color,
          fontSize: `${this.form.editFontSize}px`,
        };
      },
    },
    watch: {
      form: {
        handler() {
          if (this.form.type === 'text' && this.form.editing) {
            setTimeout(() => {
              this.$refs.textarea.focus();
            });
          }
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-editor {
    position: absolute;
    top: 0;
    left: 0;

    textarea {
      display: block;
      white-space: nowrap;
      border: 1px dashed $primary-color;
      padding: 5px;
      outline: none;
      line-height: 1.5;
      background: transparent;
    }

    .text-operate {
      margin-top: 5px;
    }
  }
</style>
