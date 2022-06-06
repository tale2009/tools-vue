<template>
  <div
    class="field-center-card"
    :class="cardClass"
    :style="cardStyle"
    ondragstart="return false"
  >
    <div v-if="data.image" class="card-image">
      <el-image :src="data.image">
        <template #placeholder>
          <div class="image-slot">
            <i class="fa-light fa-loader fa-spin" />
          </div>
        </template>
        <template #error>
          <div class="image-slot">
            <i class="fa-light fa-image" />
            <p class="image-tip">暂无卡图</p>
          </div>
        </template>
      </el-image>
    </div>

    <div class="card-mask" :style="maskStyle">
      <el-image :src="baseImage + '/card-mask.png'" fit="cover" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'FieldCenterCard',
    props: ['data'],
    methods: {},
    computed: {
      ...mapState(['staticURL']),
      baseImage() {
        return `${this.staticURL}/field-center/image`;
      },
      cardClass() {
        return `${this.data.cardBack ? 'card-back' : ''}`;
      },
      cardStyle() {
        let background;
        if (this.data.cardBack) {
          background = `url(${this.baseImage}/card-back.png) no-repeat center/cover`;
        } else {
          background = `url(${this.baseImage}/card-background.png) no-repeat center/cover`;
        }
        return {
          transform: `scale(${this.data.scale})`,
          background: background,
          borderRadius: this.data.radius ? '24px' : '',
          marginRight: `${(this.data.scale - 1) * 1488}px`,
          marginBottom: `${(this.data.scale - 1) * 2079}px`,
        };
      },
      maskStyle() {
        return {
          borderRadius: this.data.radius ? '24px' : '',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .field-center-card {
    width: 1488px;
    height: 2079px;
    display: inline-flex;
    text-align: left;
    flex-wrap: wrap;
    flex-grow: 0;
    flex-shrink: 0;
    white-space: pre-wrap;
    vertical-align: top;
    position: relative;
    user-select: none;
    color: black;
    transform-origin: 0 0;

    .card-image {
      position: absolute;
      left: 90px;
      top: 85px;
      width: 1308px;
      height: 1907px;

      .el-image {
        width: 100%;
        height: 100%;

        .image-slot {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          justify-content: center;
          align-items: center;
          font-size: 120px;
          color: var(--normal-color);

          .image-tip {
            font-family: var(--default-font-family);
            font-size: 28px;
            margin: 20px 0 0;
            line-height: 1.7;
          }
        }
      }
    }

    .card-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 1488px;
      height: 2079px;
      z-index: 10;
      overflow: hidden;
    }

    &.card-back {
      * {
        display: none;
      }
    }
  }
</style>
