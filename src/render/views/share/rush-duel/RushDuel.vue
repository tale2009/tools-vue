<template>
  <div class="share-yugioh-container">
    <el-scrollbar>
      <RushDuelCard v-if="dataLoaded" :data="form" />
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
  import RushDuelCard from '@/render/views/rush-duel/components/RushDuelCard';
  import { parseRushDuelCard } from '@/render/views/rush-duel/rush-duel';
  import { mapState } from 'vuex';

  export default {
    name: 'ShareRushDuel',
    components: {
      RushDuelCard,
    },
    data() {
      return {
        cardId: '',
        cardInfo: {},
        form: {
          language: 'sc',
          color: '',
          descriptionZoom: 1,
          password: '',
          copyright: '',
          laser: '',
          rare: '',
          radius: true,
          scale: 0.5,
          width: '',
          // 更多字段参照：@/views/yugioh/Yugioh.vue
        },
        dataLoaded: false,
      };
    },
    created() {
      const query = this.$route.query;
      this.cardId = query.cardId || '';
      this.form.language = query.language || 'sc';
      this.form.color = query.color || '';
      this.form.descriptionZoom = Number(query.descriptionZoom) || 1;
      this.form.password = query.password || '';
      this.form.copyright = query.copyright || '';
      this.form.laser = query.laser || '';
      this.form.rare = query.rare || '';
      this.form.radius = query.radius === 'true';
      this.form.width = Number(query.width) || 0;
      this.updateScale();
      if (this.cardId) {
        this.getCardInfo();
      } else if (this.form.password) {
        this.searchCardByPassword();
      } else {
        this.getRandomCard();
      }
    },
    mounted() {
      addEventListener('resize', this.updateScale);
    },
    beforeUnmount() {
      removeEventListener('resize', this.updateScale);
    },
    methods: {
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
            Object.assign(this.form, this.cardInfo.data);
            document.title = `${this.$route.meta.title} - ${this.cardName}`;
            this.dataLoaded = true;
            this.updateScale();
          });
        }
      },
      searchCardByPassword() {
        this.axios({
          method: 'get',
          url: '/rush-duel/card/' + this.form.password,
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = parseRushDuelCard(res.data, this.form.language);
          Object.assign(this.form, cardInfo);
          document.title = `${this.$route.meta.title} - ${this.cardName}`;
          this.dataLoaded = true;
        });
      },
      getRandomCard() {
        this.axios({
          method: 'get',
          url: '/rush-duel/random-card',
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = parseRushDuelCard(res.data, this.form.language);
          Object.assign(this.form, cardInfo);
          document.title = `${this.$route.meta.title} - ${this.cardName}`;
          this.dataLoaded = true;
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
      ...mapState(['fontLoading', 'staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
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
