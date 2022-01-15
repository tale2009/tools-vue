<template>
  <el-dialog
    title="一键注音"
    :model-value="modelValue"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      ref="form"
      :model="form"
      label-position="top"
    >
      <el-form-item label="注音只支持 OCG 常用语" prop="text">
        <el-input
          v-model="form.text"
          type="textarea"
          :autosize="{minRows: 3}"
          placeholder="请输入文本"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="addKana">注音</el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: 'KanjiKanaDialog',
    props: ['modelValue'],
    data() {
      return {
        form: {
          text: '',
        },
      };
    },
    methods: {
      closeDialog() {
        this.$refs.form.resetFields();
        this.$emit('update:modelValue', false);
      },
      addKana() {
        this.form.text = this.kanjiToKana(this.form.text);
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
