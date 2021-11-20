<template>
  <div class="share-yugioh-container">
    <el-scrollbar>
      <YugiohCard v-if="dataLoaded" :data="form" :refresh-key="refreshKey" />
    </el-scrollbar>
    <div v-if="fontLoading" class="font-loading">
      <el-alert
        title="字体加载中..."
        effect="dark"
        center
        :closable="false"
      />
    </div>
  </div>
</template>

<script>
  import YugiohCard from '@/views/yugioh/components/YugiohCard';

  export default {
    name: 'ShareYugioh',
    components: {
      YugiohCard,
    },
    data() {
      return {
        refreshKey: 0,
        fontLoading: false,
        form: {
          language: 'sc',
          gradient: false,
          gradientColor1: '#999999',
          gradientColor2: '#ffffff',
          gradientPreset: 'silver',
          descriptionZoom: 1,
          radius: true,
          scale: 0.5,
          // 更多字段参照：@/views/yugioh/Yugioh.vue
        },
        dataLoaded: false,
      };
    },
    created() {
      const query = this.$route.query;
      this.form.password = query.password || '';
      this.form.language = query.language || 'sc';
      this.form.gradient = query.gradient === 'true';
      this.form.gradientPreset = query.gradientPreset || 'silver';
      this.form.radius = query.radius !== 'false';
      this.form.width = query.width || '';
      this.updateScale();
      if (this.form.gradient) {
        this.changeGradientPreset(this.form.gradientPreset);
      }
      if (this.form.password) {
        this.searchCardByPassword();
      } else {
        this.getRandomCard();
      }
    },
    mounted() {
      this.refreshFont();
      addEventListener('resize', this.updateScale);
    },
    beforeUnmount() {
      removeEventListener('resize', this.updateScale);
    },
    methods: {
      // 刷新字体
      refreshFont() {
        setTimeout(() => {
          this.fontLoading = true;
          document.fonts.ready.then(() => {
            this.fontLoading = false;
            this.refreshKey++;
          });
        });
      },
      changeGradientPreset(value) {
        if (value === 'silver') {
          this.form.gradientColor1 = '#999999';
          this.form.gradientColor2 = '#ffffff';
        } else if (value === 'gold') {
          this.form.gradientColor1 = '#cc9900';
          this.form.gradientColor2 = '#ffff00';
        } else if (value === 'red') {
          this.form.gradientColor1 = '#990000';
          this.form.gradientColor2 = '#ff0000';
        } else if (value === 'white') {
          this.form.gradientColor1 = '#ffffff';
          this.form.gradientColor2 = '#ffffff';
        } else if (value === 'blue') {
          this.form.gradientColor1 = '#009999';
          this.form.gradientColor2 = '#00ffff';
        } else if (value === 'green') {
          this.form.gradientColor1 = '#009900';
          this.form.gradientColor2 = '#00ff00';
        }
      },
      searchCardByPassword() {
        this.axios({
          method: 'get',
          url: '/yugioh/card/' + this.form.password,
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
          Object.assign(this.form, cardInfo);
          document.title = `${this.$route.meta.title} - ${this.cardName}`;
          this.dataLoaded = true;
          this.refreshFont();
        });
      },
      getRandomCard() {
        this.axios({
          method: 'get',
          url: '/yugioh/random-card',
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
          Object.assign(this.form, cardInfo);
          document.title = `${this.$route.meta.title} - ${this.cardName}`;
          this.dataLoaded = true;
          this.refreshFont();
        });
      },
      // 把卡片宽度转换成scale
      updateScale() {
        const width = this.form.width;
        if (width) {
          this.form.scale = width / 1393;
        } else {
          this.form.scale = Math.min((document.body.offsetWidth / 1393), 1);
        }
      },
    },
    computed: {
      cardName() {
        return this.form.name.replace(/\[(.*?)\(.*?\)]/g, '$1');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .share-yugioh-container {
    height: 100vh;
    text-align: center;
    position: relative;

    .font-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      .el-alert {
        background: $primary-color;
      }
    }
  }
</style>
