<template>
  <el-dialog
    title="图片裁切"
    :model-value="modelValue"
    :width="maxDialogWidth(800)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <vue-cropper
      ref="cropper"
      drag-mode="none"
      :zoomable="false"
      :toggle-drag-mode-on-dblclick="false"
      :aspect-ratio="aspectRatio"
      :auto-crop-area="1"
      :view-mode="2"
    />
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VueCropper from 'vue-cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { nextTick } from 'vue';
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'CropperDialog',
    props: ['modelValue', 'image', 'aspectRatio'],
    emits: ['get-data'],
    components: {
      VueCropper,
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$emit('update:modelValue', false);
      },
      confirm() {
        const image = this.$refs.cropper.getCroppedCanvas().toDataURL('image/png', 1);
        this.$emit('get-data', image);
        this.closeDialog();
      },
    },
    watch: {
      modelValue() {
        if (this.modelValue) {
          nextTick(() => {
            this.$refs.cropper.replace(this.image);
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
