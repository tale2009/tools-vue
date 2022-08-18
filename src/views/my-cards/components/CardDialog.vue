<template>
  <el-dialog
    custom-class="card-dialog"
    :model-value="modelValue"
    :width="maxDialogWidth(600)"
    :before-close="closeDialog"
  >
    <template v-if="Object.keys(cardInfo).length">
      <YugiohCard v-if="cardInfo.type === 'yugioh'" :data="cardInfo.data" />
      <RushDuelCard v-if="cardInfo.type === 'rushDuel'" :data="cardInfo.data" />
    </template>
  </el-dialog>
</template>

<script>
  import YugiohCard from '@/views/yugioh/components/YugiohCard';
  import RushDuelCard from '@/views/rush-duel/components/RushDuelCard';
  import { maxDialogWidth } from '@/utils';
  import { mapState } from 'vuex';

  export default {
    name: 'CardDialog',
    props: ['modelValue', 'cardId'],
    components: {
      YugiohCard,
      RushDuelCard,
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
        this.cardInfo = {};
        this.$emit('update:modelValue', false);
      },
      getCardInfo() {
        if (this.cardId) {
          this.axios({
            method: 'get',
            url: '/card/' + this.cardId,
          }).then(res => {
            this.cardInfo = res.data;
            if (this.cardInfo.image) {
              this.cardInfo.data.image = `${this.baseImage}/${this.cardInfo.image}`;
            }
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
    computed: {
      ...mapState(['staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
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
