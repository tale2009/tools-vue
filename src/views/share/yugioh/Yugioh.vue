<template>
    <div class="share-yugioh-container">
        <el-scrollbar>
            <YugiohCard v-if="dataLoaded" :data="form" :refreshKey="refreshKey"></YugiohCard>
        </el-scrollbar>
        <div class="font-loading" v-if="fontLoading">
            <el-alert title="字体加载中..." effect="dark" center :closable="false"></el-alert>
        </div>
    </div>
</template>

<script>
    import YugiohCard from '@/views/yugioh/components/YugiohCard';
    import { mapState } from 'vuex';

    export default {
        name: 'ShareYugioh',
        components: {
            YugiohCard
        },
        data() {
            return {
                refreshKey: 0,
                fontLoading: false,
                form: {
                    language: 'sc',
                    descriptionZoom: 1,
                    radius: true,
                    scale: 0.5
                    // 更多字段参照：@/views/yugioh/Yugioh.vue
                },
                dataLoaded: false
            };
        },
        created() {
            const query = this.$route.query;
            this.form.password = query.password || '';
            this.form.language = query.language || 'sc';
            this.form.radius = query.radius !== 'false';
            this.form.width = query.width || '';
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
                        lang: this.form.language
                    }
                }).then(res => {
                    let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
                    Object.assign(this.form, cardInfo);
                    document.title = `${this.$route.meta.title} - ${this.cardName}`;
                    this.dataLoaded = true;
                });
            },
            getRandomCard() {
                this.axios({
                    method: 'get',
                    url: '/yugioh/random-card',
                    params: {
                        lang: this.form.language
                    }
                }).then(res => {
                    let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
                    Object.assign(this.form, cardInfo);
                    document.title = `${this.$route.meta.title} - ${this.cardName}`;
                    this.dataLoaded = true;
                });
            },
            // 把卡片宽度转换成scale
            updateScale() {
                const width = this.form.width;
                if (width) {
                    this.form.scale = width / 1393;
                } else {
                    this.form.scale = Math.min((document.body.offsetWidth * this.devicePixelRatio / 1393), 1);
                }
            }
        },
        computed: {
            ...mapState(['devicePixelRatio']),
            cardName() {
                return this.form.name.replace(/\[(.*?)\(.*?\)]/g, '$1');
            }
        }
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