<template>
  <el-dialog
    title="关于 & 赞助"
    :model-value="modelValue"
    :width="maxDialogWidth(500)"
    :before-close="closeDialog"
  >
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'AboutDialog',
    props: ['modelValue'],
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$emit('update:modelValue', false);
      },
      toCourse() {
        open('https://www.bilibili.com/read/readlist/rl314448');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .about-main {
    margin: -10px 0;

    p {
      line-height: 1.7;
      margin: 10px 0;

      .el-button {
        padding: 0;
        height: auto;
        border: none;
        line-height: 1.7;
        vertical-align: top;
      }
    }
  }

  .el-popover {
    .el-image {
      vertical-align: top;
    }
  }
</style>
