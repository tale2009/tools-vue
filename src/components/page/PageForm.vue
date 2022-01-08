<template>
  <div class="page-form-container">
    <div class="form-header">
      <div v-if="$slots.title || title" class="form-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.description || description" class="form-description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>

    <div class="form-main">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageForm',
    props: ['title', 'description'],
  };
</script>

<style lang="scss" scoped>
  .page-form-container {
    .form-header {
      padding: 30px 20px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid $border-color;

      .form-title {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }

      .form-description {
        margin-top: 20px;
        font-size: 12px;
        font-weight: normal;
        color: $info-color;
      }
    }

    .form-main {
      padding: 20px;

      ::v-deep(.el-form) {
        .el-form-item {
          .tip {
            margin-left: 10px;
            color: $normal-color;
          }

          & > .el-input, .el-cascader, .el-select, .el-date-editor, .el-autocomplete {
            width: 100%;
          }
        }
      }
    }
  }
</style>
