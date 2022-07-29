<template>
  <div
    class="yugioh-back-card notranslate"
    :style="cardStyle"
    ondragstart="return false"
  >
    <div v-if="data.konami" class="card-konami">
      <el-image :src="baseImage + '/konami.png'" />
    </div>

    <div v-if="data.register" class="card-register">
      <el-image :src="baseImage + '/register.png'" />
    </div>

    <div v-if="data.logo" class="card-logo" :style="logoStyle">
      <el-image :src="logoSrc" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'YugiohBackCard',
    props: ['data'],
    computed: {
      ...mapState(['staticURL']),
      baseImage() {
        return `${this.staticURL}/yugioh-back/image`;
      },
      cardStyle() {
        const background = `url(${this.baseImage}/card-${this.data.type}.png) no-repeat center/cover`;
        return {
          transform: `scale(${this.data.scale})`,
          background: background,
          borderRadius: this.data.radius ? '24px' : '',
          marginRight: `${(this.data.scale - 1) * 1394}px`,
          marginBottom: `${(this.data.scale - 1) * 2031}px`,
        };
      },
      logoStyle() {
        let top, left;
        if (this.data.logo === 'ocg') {
          top = '1722px';
          left = '878px';
        } else if (this.data.logo === 'tcg') {
          top = '1763px';
          left = '859px';
        } else if (this.data.logo === 'rd') {
          top = '1763px';
          left = '864px';
        }
        return {
          top,
          left,
        };
      },
      logoSrc() {
        return `${this.baseImage}/logo-${this.data.logo}.png`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .yugioh-back-card {
    width: 1394px;
    height: 2031px;
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

    .card-konami {
      position: absolute;
      top: 95px;
      left: 94px;
      z-index: 10;
    }

    .card-register {
      position: absolute;
      top: 114px;
      left: 370px;
      z-index: 10;
    }

    .card-logo {
      position: absolute;
      z-index: 10;
    }
  }
</style>
