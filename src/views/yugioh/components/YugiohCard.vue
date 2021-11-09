<template>
    <div class="yugioh-card" :class="cardClass" :style="cardStyle" ondragstart="return false">
        <div class="card-name" v-name-color="data.color">
            <CompressText :text="data.name" :refreshKey="refreshKey" :width="1030" :height="200"></CompressText>
        </div>

        <div class="card-attribute" v-if="data.attribute">
            <el-image :src="attributeSrc"></el-image>
        </div>

        <div class="card-level" v-if="showLevel" :style="levelStyle">
            <el-image v-for="item in data.level" :src="baseImage + '/level.png'"></el-image>
        </div>

        <div class="card-rank" v-if="showRank" :style="rankStyle">
            <el-image v-for="item in data.rank" :src="baseImage + '/rank.png'"></el-image>
        </div>

        <div class="spell-trap" v-if="['spell','trap'].includes(data.type)">
            <span>{{ ['en', 'kr'].includes(data.language) ? '[' : '【' }}</span>
            <CompressText :text="spellTrapName" :refreshKey="refreshKey"></CompressText>
            <el-image class="spell-trap-icon" v-if="data.icon" :src="`${baseImage}/icon-${data.icon}.png`"></el-image>
            <span>{{ ['en', 'kr'].includes(data.language) ? ']' : '】' }}</span>
        </div>

        <div class="card-image" v-if="data.image" :style="imageStyle">
            <el-image :src="data.image">
                <template #placeholder>
                    <div class="image-slot">
                        <i class="fal fa-spinner fa-pulse"></i>
                    </div>
                </template>
                <template #error>
                    <div class="image-slot">
                        <i class="fal fa-image"></i>
                    </div>
                </template>
            </el-image>
        </div>

        <div class="card-mask" :style="maskStyle">
            <el-image v-if="data.type==='pendulum'" :src="baseImage + '/card-mask-pendulum.png'" fit="cover"></el-image>
            <el-image v-else :src="baseImage + '/card-mask.png'" fit="cover"></el-image>
        </div>

        <div class="left-pendulum" v-if="data.type==='pendulum'">
            <span>{{ data.pendulumScale }}</span>
        </div>

        <div class="right-pendulum" v-if="data.type==='pendulum'">
            <span>{{ data.pendulumScale }}</span>
        </div>

        <div class="pendulum-description" v-if="data.type==='pendulum'">
            <CompressText :text="data.pendulumDescription" :width="950" :height="230" :refreshKey="refreshKey"></CompressText>
        </div>

        <div class="card-package" :style="packageStyle">
            <span>{{ data.package }}</span>
        </div>

        <div class="link-arrow" v-if="data.type==='monster'&&data.cardType==='link'">
            <el-image :src="baseImage + '/arrow-up-on.png'" style="top: 293px;left: 569px" v-show="data.arrowList.includes(1)"></el-image>
            <el-image :src="baseImage + '/arrow-right-up-on.png'" style="top: 313px;left: 1141px" v-show="data.arrowList.includes(2)"></el-image>
            <el-image :src="baseImage + '/arrow-right-on.png'" style="top: 774px;left: 1221px" v-show="data.arrowList.includes(3)"></el-image>
            <el-image :src="baseImage + '/arrow-right-down-on.png'" style="top: 1347px;left: 1141px" v-show="data.arrowList.includes(4)"></el-image>
            <el-image :src="baseImage + '/arrow-down-on.png'" style="top: 1427px;left: 569px" v-show="data.arrowList.includes(5)"></el-image>
            <el-image :src="baseImage + '/arrow-left-down-on.png'" style="top: 1347px;left: 109px" v-show="data.arrowList.includes(6)"></el-image>
            <el-image :src="baseImage + '/arrow-left-on.png'" style="top: 774px;left: 88px" v-show="data.arrowList.includes(7)"></el-image>
            <el-image :src="baseImage + '/arrow-left-up-on.png'" style="top: 313px;left: 109px" v-show="data.arrowList.includes(8)"></el-image>

            <el-image :src="baseImage + '/arrow-up-off.png'" style="top: 293px;left: 569px" v-show="!data.arrowList.includes(1)"></el-image>
            <el-image :src="baseImage + '/arrow-right-up-off.png'" style="top: 313px;left: 1141px" v-show="!data.arrowList.includes(2)"></el-image>
            <el-image :src="baseImage + '/arrow-right-off.png'" style="top: 774px;left: 1221px" v-show="!data.arrowList.includes(3)"></el-image>
            <el-image :src="baseImage + '/arrow-right-down-off.png'" style="top: 1347px;left: 1141px" v-show="!data.arrowList.includes(4)"></el-image>
            <el-image :src="baseImage + '/arrow-down-off.png'" style="top: 1427px;left: 569px" v-show="!data.arrowList.includes(5)"></el-image>
            <el-image :src="baseImage + '/arrow-left-down-off.png'" style="top: 1347px;left: 109px" v-show="!data.arrowList.includes(6)"></el-image>
            <el-image :src="baseImage + '/arrow-left-off.png'" style="top: 771px;left: 87px" v-show="!data.arrowList.includes(7)"></el-image>
            <el-image :src="baseImage + '/arrow-left-up-off.png'" style="top: 313px;left: 109px" v-show="!data.arrowList.includes(8)"></el-image>
        </div>

        <div class="card-description" v-card-description>
            <div v-if="['monster','pendulum'].includes(data.type) && data.monsterType" class="card-effect">
                <CompressText :text="monsterType" :refreshKey="refreshKey"></CompressText>
            </div>

            <div class="description-info" :style="descriptionStyle">
                <template v-for="(item,index) in data.description.split('\n')">
                    <!--判断首行是否压缩-->
                    <div v-if="index === 0 && data.firstLineCompress">
                        <CompressText :text="item" :width="1170" :height="70" :refreshKey="refreshKey"></CompressText>
                    </div>
                    <!--单行不压缩-->
                    <div v-else-if="index < data.description.split('\n').length - 1">
                        <CompressText :text="item" :refreshKey="refreshKey"></CompressText>
                    </div>
                    <!--最后一行压缩-->
                    <div v-else-if="index === data.description.split('\n').length - 1" class="last-description">
                        <CompressText :text="item" :width="1170" :height="lastDescriptionHeight" :refreshKey="refreshKey"
                                      :language="data.language" autoSizeElement=".card-description"></CompressText>
                    </div>
                    <!--item为空提供换行-->
                    <br v-if="!item">
                </template>
            </div>
        </div>

        <div class="atk-def-link">
            <el-image :src="baseImage + '/atk-def.svg'"
                      v-if="(data.type==='monster'&&data.cardType!=='link')||data.type==='pendulum'"></el-image>
            <el-image :src="baseImage + '/atk-link.svg'" v-if="data.type==='monster'&&data.cardType==='link'"></el-image>
        </div>

        <div class="card-atk" v-if="['monster','pendulum'].includes(data.type)">
            <span v-if="data.atk >= 0">{{ data.atk }}</span>
            <span v-else-if="data.atk === -1">?</span>
        </div>

        <div class="card-def" v-if="(data.type==='monster'&&data.cardType!=='link')||data.type==='pendulum'">
            <span v-if="data.def >= 0">{{ data.def }}</span>
            <span v-else-if="data.def === -1">?</span>
        </div>

        <div class="card-link" v-if="data.type==='monster'&&data.cardType==='link'">
            <span>{{ data.arrowList.length }}</span>
        </div>

        <div class="card-password" :style="passwordStyle">
            <span>{{ data.password }}</span>
        </div>

        <div class="card-copyright" v-if="data.copyright">
            <el-image :src="copyrightSrc"></el-image>
        </div>

        <div class="card-laser" v-if="data.laser">
            <el-image :src="baseImage + '/laser.png'"></el-image>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CompressText from '@/views/yugioh/components/CompressText';

    export default {
        name: 'YugiohCard',
        components: {
            CompressText
        },
        props: ['data', 'refreshKey'],
        data() {
            return {
                lastDescriptionHeight: 300   // 最后一行效果压缩高度
            };
        },
        methods: {
            // 获取最后一行效果的压缩高度
            getLastDescriptionHeight() {
                let lastDescription = document.querySelector('.last-description');
                if (lastDescription) {
                    if (['monster', 'pendulum'].includes(this.data.type)) {
                        this.lastDescriptionHeight = 330 - lastDescription.offsetTop;
                    } else {
                        this.lastDescriptionHeight = 380 - lastDescription.offsetTop;
                    }
                    if (this.lastDescriptionHeight <= 40) {
                        this.$message.warning('文本超过可压缩高度');
                    }
                } else {
                    this.lastDescriptionHeight = 0;
                }
            }
        },
        computed: {
            ...mapState(['devicePixelRatio', 'staticURL']),
            baseImage() {
                return `${this.staticURL}/yugioh/image`;
            },
            cardClass() {
                return `${this.data.language}-class ${this.data.cardBack ? 'card-back' : ''}`;
            },
            cardStyle() {
                let background;
                if (this.data.cardBack) {
                    background = `url(${this.baseImage}/card-back.png) no-repeat center/cover`;
                } else if (this.data.type === 'monster') {
                    background = `url(${this.baseImage}/card-${this.data.cardType}.png) no-repeat center/cover`;
                } else if (this.data.type === 'pendulum') {
                    background = `url(${this.baseImage}/card-${this.data.pendulumType}.png) no-repeat center/cover`;
                } else {
                    background = `url(${this.baseImage}/card-${this.data.type}.png) no-repeat center/cover`;
                }
                return {
                    transform: `scale(${this.data.scale / this.devicePixelRatio})`,
                    background: background,
                    borderRadius: this.data.radius ? '24px' : '',
                    marginRight: `${(this.data.scale / this.devicePixelRatio - 1) * 1393}px`,
                    marginBottom: `${(this.data.scale / this.devicePixelRatio - 1) * 2031}px`,
                    '--descriptionZoom': this.data.descriptionZoom
                };
            },
            attributeSrc() {
                let suffix = '';
                if (this.data.language === 'jp') {
                    suffix = '-jp';
                } else if (this.data.language === 'kr') {
                    suffix = '-kr';
                } else if (this.data.language === 'en') {
                    suffix = '-en';
                }
                if (['monster', 'pendulum'].includes(this.data.type)) {
                    return `${this.baseImage}/attribute-${this.data.attribute}${suffix}.png`;
                } else {
                    return `${this.baseImage}/attribute-${this.data.type}${suffix}.png`;
                }
            },
            spellTrapName() {
                let name = '';
                if (this.data.language === 'sc') {
                    if (this.data.type === 'spell') {
                        name = '魔法卡';
                    } else if (this.data.type === 'trap') {
                        name = '陷阱卡';
                    }
                } else if (this.data.language === 'tc') {
                    if (this.data.type === 'spell') {
                        name = '魔法卡';
                    } else if (this.data.type === 'trap') {
                        name = '陷阱卡';
                    }
                } else if (this.data.language === 'jp') {
                    if (this.data.type === 'spell') {
                        name = '[魔(ま)][法(ほう)]カード';
                    } else if (this.data.type === 'trap') {
                        name = '[罠(トラップ)]カード';
                    }
                } else if (this.data.language === 'kr') {
                    if (this.data.type === 'spell') {
                        name = '마법 카드';
                    } else if (this.data.type === 'trap') {
                        name = '함정 카드';
                    }
                } else if (this.data.language === 'en') {
                    if (this.data.type === 'spell') {
                        name = 'Spell Card';
                    } else if (this.data.type === 'trap') {
                        name = 'Trap Card';
                    }
                }
                return name;
            },
            showLevel() {
                let flag = false;
                if (this.data.type === 'monster') {
                    flag = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'token'].includes(this.data.cardType);
                } else if (this.data.type === 'pendulum') {
                    flag = ['normal-pendulum', 'effect-pendulum', 'ritual-pendulum', 'fusion-pendulum', 'synchro-pendulum'].includes(this.data.pendulumType);
                }
                return flag;
            },
            showRank() {
                let flag = false;
                if (this.data.type === 'monster') {
                    flag = this.data.cardType === 'xyz';
                } else if (this.data.type === 'pendulum') {
                    flag = this.data.pendulumType === 'xyz-pendulum';
                }
                return flag;
            },
            levelStyle() {
                let right;
                if (this.data.level < 13) {
                    right = '146px';
                } else {
                    right = '100px';
                }
                return {
                    right: right
                };
            },
            rankStyle() {
                let left;
                if (this.data.rank < 13) {
                    left = '147px';
                } else {
                    left = '100px';
                }
                return {
                    left: left
                };
            },
            imageStyle() {
                let left, top, width, height;
                if (this.data.type === 'pendulum') {
                    left = '96px';
                    top = '367px';
                    width = '1201px';
                    height = '1201px';
                } else {
                    left = '171px';
                    top = '376px';
                    width = '1051px';
                    height = '1051px';
                }
                return {
                    left: left,
                    top: top,
                    width: width,
                    height: height
                };
            },
            maskStyle() {
                let left, top;
                if (this.data.type === 'pendulum') {
                    left = '81px';
                    top = '1254px';
                } else {
                    left = '168px';
                    top = '373px';
                }
                return {
                    left: left,
                    top: top
                };
            },
            packageStyle() {
                let top, left, right;
                if (this.data.type === 'pendulum') {
                    top = '1854px';
                    left = '116px';
                } else if (this.data.type === 'monster' && this.data.cardType === 'link') {
                    top = '1455px';
                    right = '252px';
                } else {
                    top = '1455px';
                    right = '148px';
                }
                return {
                    color: this.data.type === 'monster' && this.data.cardType === 'xyz' ? 'white' : 'black',
                    top: top,
                    left: left,
                    right: right
                };
            },
            descriptionStyle() {
                let fontFamily;
                if (this.data.language === 'en') {
                    if ((this.data.type === 'monster' && this.data.cardType === 'normal') ||
                        (this.data.type === 'pendulum' && this.data.pendulumType === 'normal-pendulum')) {
                        fontFamily = 'ygo-en-italic';
                    }
                }
                return {
                    fontFamily: fontFamily
                };
            },
            passwordStyle() {
                return {
                    color: this.data.type === 'monster' && this.data.cardType === 'xyz' ? 'white' : 'black'
                };
            },
            monsterType() {
                const leftBracket = ['en', 'kr'].includes(this.data.language) ? '[' : '【';
                const rightBracket = ['en', 'kr'].includes(this.data.language) ? ']' : '】';
                return `${leftBracket}${this.data.monsterType}${rightBracket}`;

            },
            copyrightSrc() {
                let color = this.data.type === 'monster' && this.data.cardType === 'xyz' ? 'white' : 'black';
                return `${this.baseImage}/copyright-${this.data.copyright}-${color}.svg`;
            },
            cardName() {
                return this.data.name.replace(/\[(.*?)\(.*?\)]/g, '$1');
            }
        },
        directives: {
            nameColor(el, binding) {
                let that = binding.instance;
                // 文本和注音颜色分开控制
                let color = 'black';
                // 自动颜色
                if ((that.data.type === 'monster' && ['xyz', 'link'].includes(that.data.cardType)) || ['spell', 'trap'].includes(that.data.type) ||
                    (that.data.type === 'pendulum' && ['xyz-pendulum', 'link-pendulum'].includes(that.data.pendulumType))) {
                    color = 'white';
                }
                el.style.color = binding.value || color;
                let rtList = el.querySelectorAll('.rt');
                rtList.forEach(rt => {
                    rt.style.color = color;
                });
            },
            cardDescription(el, binding) {
                let that = binding.instance;
                that.getLastDescriptionHeight();
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../style/sc";
    @import "../style/tc";
    @import "../style/jp";
    @import "../style/kr";
    @import "../style/en";

    .yugioh-card {
        width: 1393px;
        height: 2031px;
        display: inline-flex;
        text-align: left;
        flex-wrap: wrap;
        flex-grow: 0;
        flex-shrink: 0;
        vertical-align: top;
        position: relative;
        user-select: none;
        color: black;
        transform-origin: 0 0;
        overflow: hidden;

        .card-name {
            position: absolute;
            left: 116px;
            width: 1030px;
        }

        .card-attribute {
            position: absolute;
            left: 1159px;
            top: 96px;
        }

        .card-level {
            position: absolute;
            top: 250px;

            .el-image {
                margin-left: 3px;
            }
        }

        .card-rank {
            position: absolute;
            top: 250px;

            .el-image {
                margin-right: 3px;
            }
        }

        .spell-trap {
            position: absolute;
            display: flex;
            align-items: center;

            .el-image {
                display: flex;
                min-width: 72px;
            }
        }

        .card-image {
            position: absolute;

            .el-image {
                width: 100%;
                height: 100%;

                .image-slot {
                    display: flex;
                    height: 100%;
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                    font-size: 120px;
                    color: $normal-color;
                }
            }
        }

        .card-mask {
            position: absolute;
            z-index: 10;
        }

        .left-pendulum {
            position: absolute;
            top: 1379px;
            left: 93px;
            width: 95px;
            font-family: ygo-atk-def, serif;
            font-size: 98px;
            text-align: center;
            letter-spacing: -10px;
            z-index: 20;
        }

        .right-pendulum {
            position: absolute;
            top: 1379px;
            right: 104px;
            width: 95px;
            font-family: ygo-atk-def, serif;
            font-size: 98px;
            text-align: center;
            letter-spacing: -10px;
            z-index: 20;
        }

        .pendulum-description {
            position: absolute;
            left: 221px;
            width: 950px;
            text-align: justify;
            z-index: 20;
        }

        .card-package {
            position: absolute;
            font-family: ygo-password, serif;
            font-size: 40px;
            z-index: 20;
        }

        .link-arrow {
            .el-image {
                position: absolute;
                z-index: 20;
            }
        }

        .card-description {
            position: absolute;
            left: 109px;
            width: 1170px;
            text-align: justify;
            z-index: 20;

            .card-effect {
                white-space: nowrap;
            }
        }

        .atk-def-link {
            position: absolute;
            left: 109px;
            top: 1844px;
            z-index: 20;
        }

        .card-atk {
            position: absolute;
            right: 395px;
            top: 1845px;
            font-family: ygo-atk-def, serif;
            font-size: 61px;
            letter-spacing: 2px;
            z-index: 20;
        }

        .card-def {
            position: absolute;
            right: 124px;
            top: 1845px;
            font-family: ygo-atk-def, serif;
            font-size: 61px;
            letter-spacing: 2px;
            z-index: 20;
        }

        .card-link {
            position: absolute;
            right: 124px;
            top: 1854px;
            font-family: ygo-link, serif;
            font-size: 44px;
            transform: scaleX(1.3);
            transform-origin: 50% 50%;
            letter-spacing: 2px;
            z-index: 20;
        }

        .card-password {
            position: absolute;
            left: 66px;
            top: 1929px;
            font-family: ygo-password, serif;
            font-size: 40px;
            z-index: 20;
        }

        .card-copyright {
            position: absolute;
            top: 1936px;
            right: 141px;
            z-index: 20;
        }

        .card-laser {
            position: absolute;
            left: 1276px;
            top: 1913px;
            z-index: 20;
        }

        &.card-back {
            * {
                display: none;
            }
        }
    }
</style>