<template>
  <el-dialog
    class="card-dialog"
    align-center
    :model-value="modelValue"
    :width="cardWidth"
    :before-close="closeDialog"
  >
    <div ref="perspectiveCard" class="perspective-card" :style="perspectiveCardStyle">
      <div class="perspective-card__transformer">
        <div class="perspective-card__artwork perspective-card__artwork--front">
          <template v-if="Object.keys(cardInfo).length">
            <YugiohCard v-if="cardInfo.type === 'yugioh'" :data="cardInfo.data" />
            <RushDuelCard v-if="cardInfo.type === 'rushDuel'" :data="cardInfo.data" />
          </template>
        </div>
        <div class="perspective-card__artwork perspective-card__artwork--back" />
        <div class="perspective-card__shine" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import YugiohCard from '@/render/views/yugioh/components/YugiohCard';
  import RushDuelCard from '@/render/views/rush-duel/components/RushDuelCard';
  import PerspectiveCard from 'wtc-perspective-card';
  import { maxDialogWidth } from '@/render/utils';
  import { mapState } from 'vuex';
  import { nextTick } from 'vue';

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
        perspectiveCard: {},
        cardWidth: '',
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
            this.cardInfo.data.radius = true;
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
          this.cardWidth = this.maxDialogWidth(600);
          const { offsetWidth, offsetHeight } = document.body;
          const maxCardWidth = offsetWidth * 0.8;
          const maxCardHeight = offsetHeight * 0.8;
          const scale = Math.min(maxCardWidth / 1394, maxCardHeight / 2031, 1);
          this.cardWidth = 1394 * scale;
          this.cardInfo.data.scale = scale;
          if (Object.keys(this.perspectiveCard).length) {
            this.perspectiveCard.resize();
          }
        }
      },
      initPerspectiveCard() {
        nextTick(() => {
          if (!Object.keys(this.perspectiveCard).length) {
            this.perspectiveCard = new PerspectiveCard(this.$refs.perspectiveCard, {
              ambient: true,
            });
          }
        });
      },
    },
    computed: {
      ...mapState(['staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
      perspectiveCardStyle() {
        let borderRadius;
        if (Object.keys(this.cardInfo).length) {
          borderRadius = `${this.cardInfo.data.scale * 24}px`;
        }
        return {
          borderRadius,
          perspective: `${this.cardWidth * 2.4}px`,
        };
      },
    },
    watch: {
      modelValue() {
        if (this.modelValue) {
          this.getCardInfo();
          this.initPerspectiveCard();
        }
      },
    },
  };
</script>

<style lang="scss">
  @use "../../../styles/wtc-perspective-card" as *;

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
