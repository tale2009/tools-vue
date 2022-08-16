<template>
  <el-dialog
    custom-class="card-dialog"
    :model-value="modelValue"
    :width="maxDialogWidth(600)"
    :before-close="closeDialog"
  >
    <YugiohCard v-if="Object.keys(cardInfo).length" :data="cardInfo.data" />
  </el-dialog>
</template>

<script>
  import YugiohCard from '@/views/yugioh/components/YugiohCard';
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'CardDialog',
    props: ['modelValue', 'cardId'],
    components: {
      YugiohCard,
    },
    data() {
      return {
        cardInfo: {},
      };
    },
    mounted() {
      addEventListener('resize', this.updateScale);
    },
    beforeUnmount() {
      removeEventListener('resize', this.updateScale);
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$emit('update:modelValue', false);
      },
      getCardInfo() {
        if (this.cardId) {
          this.axios({
            method: 'get',
            url: '/card/' + this.cardId,
          }).then(res => {
            this.cardInfo = res.data;
            this.updateScale();
          });
        }
      },
      // 把卡片宽度转换成scale
      updateScale() {
        if (Object.keys(this.cardInfo).length) {
          const width = this.maxDialogWidth(600);
          this.cardInfo.data.scale = width / 1394;
        }
      },
    },
    watch: {
      modelValue() {
        if (this.modelValue) {
          this.getCardInfo();
        }
      },
    },
  };
</script>

<style lang="scss">
  .card-dialog {
    background: none;
    box-shadow: none;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 0;
    }
  }
</style>
