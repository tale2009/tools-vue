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
  import { parseYugiohCard } from '@/views/yugioh/yugioh';

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
          color: '',
          align: 'left',
          gradient: false,
          gradientColor1: '#999999',
          gradientColor2: '#ffffff',
          descriptionZoom: 1,
          password: '',
          copyright: '',
          laser: false,
          rare: '',
          radius: true,
          scale: 0.5,
          cardBack: false,
          width: '',
          // 更多字段参照：@/views/yugioh/Yugioh.vue
        },
        dataLoaded: false,
      };
    },
    created() {
      const query = this.$route.query;
      this.form.language = query.language || 'sc';
      this.form.color = query.color || '';
      this.form.align = query.align || 'left';
      this.form.gradient = query.gradient === 'true';
      this.form.gradientColor1 = query.gradientColor1;
      this.form.gradientColor2 = query.gradientColor2;
      this.form.descriptionZoom = Number(query.descriptionZoom) || 1;
      this.form.password = query.password || '';
      this.form.copyright = query.copyright || '';
      this.form.laser = query.laser === 'true';
      this.form.rare = query.rare || '';
      this.form.radius = query.radius === 'true';
      this.form.cardBack = query.cardBack === 'true';
      this.form.width = Number(query.width) || 0;
      this.updateScale();
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
      searchCardByPassword() {
        this.axios({
          method: 'get',
          url: '/yugioh/card/' + this.form.password,
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = parseYugiohCard(res.data.data, this.form.language);
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
          let cardInfo = parseYugiohCard(res.data.data, this.form.language);
          Object.assign(this.form, cardInfo);
          document.title = `${this.$route.meta.title} - ${this.cardName}`;
          this.dataLoaded = true;
          this.refreshFont();
        });
      },
      // 把卡片宽度转换成scale
      updateScale() {
        const width = this.form.width;
        if (width > 0) {
          this.form.scale = width / 1394;
        } else {
          this.form.scale = Math.min((document.body.offsetWidth / 1394), 1);
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
    overflow: hidden;

    .font-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;

      .el-alert {
        background: var(--primary-color);
      }
    }
  }
</style>
