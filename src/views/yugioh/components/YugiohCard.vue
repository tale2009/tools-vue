<template>
  <div
    class="yugioh-card notranslate"
    :class="cardClass"
    :style="cardStyle"
    ondragstart="return false"
  >
    <div v-name-color="data.color" class="card-name" :style="nameStyle">
      <CompressText
        :text="data.name"
        :gradient="data.gradient"
        :gradient-color1="data.gradientColor1"
        :gradient-color2="data.gradientColor2"
        :refresh-key="refreshKey"
        :width="attributeSrc ? 1033 : 1161"
        :height="200"
      />
    </div>

    <div v-if="attributeSrc" class="card-attribute">
      <el-image :src="attributeSrc" />
    </div>

    <div v-if="showLevel" class="card-level" :style="levelStyle">
      <el-image v-for="item in data.level" :src="baseImage + '/level.png'" />
    </div>

    <div v-if="showRank" class="card-rank" :style="rankStyle">
      <el-image v-for="item in data.rank" :src="baseImage + '/rank.png'" />
    </div>

    <div v-if="['spell','trap'].includes(data.type)" class="spell-trap">
      <span>{{ ['en', 'kr'].includes(data.language) ? '[' : '【' }}</span>
      <CompressText :text="spellTrapName" :refresh-key="refreshKey" />
      <el-image v-if="data.icon" class="spell-trap-icon" :src="`${baseImage}/icon-${data.icon}.png`" />
      <span>{{ ['en', 'kr'].includes(data.language) ? ']' : '】' }}</span>
    </div>

    <div v-if="data.image" class="card-image" :style="imageStyle">
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

    <div v-if="data.type === 'pendulum'" class="pendulum-mask">
      <el-image :src="baseImage + '/card-mask-pendulum.png'" fit="cover" />
    </div>

    <div v-if="data.type === 'pendulum'" class="left-pendulum" :style="leftPendulumStyle">
      <span>{{ data.pendulumScale }}</span>
    </div>

    <div v-if="data.type === 'pendulum'" class="right-pendulum" :style="rightPendulumStyle">
      <span>{{ data.pendulumScale }}</span>
    </div>

    <div v-if="data.type === 'pendulum'" class="pendulum-description">
      <CompressText
        :text="data.pendulumDescription"
        :width="950"
        :height="230"
        :refresh-key="refreshKey"
      />
    </div>

    <div class="card-package" :style="packageStyle">
      <span>{{ data.package }}</span>
    </div>

    <div v-if="data.type === 'monster' && data.cardType === 'link'" class="link-arrow">
      <el-image v-show="data.arrowList.includes(1)" :src="baseImage + '/arrow-up-on.png'" style="top: 278px;left: 555px" />
      <el-image v-show="data.arrowList.includes(2)" :src="baseImage + '/arrow-right-up-on.png'" style="top: 299px;left: 1130px" />
      <el-image v-show="data.arrowList.includes(3)" :src="baseImage + '/arrow-right-on.png'" style="top: 761px;left: 1223px" />
      <el-image v-show="data.arrowList.includes(4)" :src="baseImage + '/arrow-right-down-on.png'" style="top: 1336px;left: 1130px" />
      <el-image v-show="data.arrowList.includes(5)" :src="baseImage + '/arrow-down-on.png'" style="top: 1428px;left: 555px" />
      <el-image v-show="data.arrowList.includes(6)" :src="baseImage + '/arrow-left-down-on.png'" style="top: 1336px;left: 95px" />
      <el-image v-show="data.arrowList.includes(7)" :src="baseImage + '/arrow-left-on.png'" style="top: 758px;left: 71px" />
      <el-image v-show="data.arrowList.includes(8)" :src="baseImage + '/arrow-left-up-on.png'" style="top: 299px;left: 95px" />

      <el-image v-show="!data.arrowList.includes(1)" :src="baseImage + '/arrow-up-off.png'" style="top: 278px;left: 555px" />
      <el-image v-show="!data.arrowList.includes(2)" :src="baseImage + '/arrow-right-up-off.png'" style="top: 299px;left: 1130px" />
      <el-image v-show="!data.arrowList.includes(3)" :src="baseImage + '/arrow-right-off.png'" style="top: 761px;left: 1223px" />
      <el-image v-show="!data.arrowList.includes(4)" :src="baseImage + '/arrow-right-down-off.png'" style="top: 1336px;left: 1130px" />
      <el-image v-show="!data.arrowList.includes(5)" :src="baseImage + '/arrow-down-off.png'" style="top: 1428px;left: 555px" />
      <el-image v-show="!data.arrowList.includes(6)" :src="baseImage + '/arrow-left-down-off.png'" style="top: 1336px;left: 95px" />
      <el-image v-show="!data.arrowList.includes(7)" :src="baseImage + '/arrow-left-off.png'" style="top: 758px;left: 71px" />
      <el-image v-show="!data.arrowList.includes(8)" :src="baseImage + '/arrow-left-up-off.png'" style="top: 299px;left: 95px" />
    </div>

    <div v-card-description class="card-description">
      <div v-if="['monster','pendulum'].includes(data.type) && data.monsterType" class="card-effect">
        <CompressText
          :text="monsterType"
          :refresh-key="refreshKey"
          :width="1175"
          :height="100"
        />
      </div>

      <div class="description-info" :style="descriptionStyle">
        <template v-for="(item,index) in data.description.split('\n')">
          <!--判断首行是否压缩-->
          <div v-if="index === 0 && data.firstLineCompress">
            <CompressText
              :text="item"
              :width="1175"
              :height="70"
              :refresh-key="refreshKey"
            />
          </div>
          <!--单行不压缩-->
          <div v-else-if="index < data.description.split('\n').length - 1">
            <CompressText :text="item" :refresh-key="refreshKey" />
          </div>
          <!--最后一行压缩-->
          <div v-else-if="index === data.description.split('\n').length - 1" class="last-description">
            <CompressText
              :text="item"
              :width="1175"
              :height="lastDescriptionHeight"
              :refresh-key="refreshKey"
              :language="data.language"
              auto-size-element=".card-description"
            />
          </div>
          <!--item为空提供换行-->
          <br v-if="!item">
        </template>
      </div>
    </div>

    <div class="atk-def-link">
      <template v-if="data.language === 'astral'">
        <el-image v-if="(data.type === 'monster' && data.cardType !== 'link') || data.type === 'pendulum'" :src="baseImage + '/atk-def-astral.svg'" />
        <el-image v-if="data.type === 'monster' && data.cardType === 'link'" :src="baseImage + '/atk-link-astral.svg'" />
      </template>
      <template v-else>
        <el-image v-if="(data.type === 'monster' && data.cardType !== 'link') || data.type === 'pendulum'" :src="baseImage + '/atk-def.svg'" />
        <el-image v-if="data.type === 'monster' && data.cardType === 'link'" :src="baseImage + '/atk-link.svg'" />
      </template>
    </div>

    <div v-if="['monster','pendulum'].includes(data.type)" class="card-atk" :style="atkStyle">
      <span v-if="data.atk >= 0">{{ data.language === 'astral' ? numberToFull(data.atk) : data.atk }}</span>
      <span v-else-if="data.atk === -1">?</span>
    </div>

    <div v-if="(data.type === 'monster' && data.cardType!=='link') || data.type === 'pendulum'" class="card-def" :style="defStyle">
      <span v-if="data.def >= 0">{{ data.language === 'astral' ? numberToFull(data.def) : data.def }}</span>
      <span v-else-if="data.def === -1">?</span>
    </div>

    <div v-if="data.type === 'monster' && data.cardType === 'link'" class="card-link" :style="linkStyle">
      <span>{{ data.language === 'astral' ? numberToFull(data.arrowList.length) : data.arrowList.length }}</span>
    </div>

    <div class="card-password" :style="passwordStyle">
      <span>{{ data.password }}</span>
    </div>

    <div v-if="data.copyright" class="card-copyright">
      <el-image :src="copyrightSrc" />
    </div>

    <div v-if="data.laser" class="card-laser">
      <el-image :src="baseImage + '/laser.png'" />
    </div>

    <div v-if="data.rare" class="card-rare" :style="rareStyle">
      <el-image :src="rareSrc" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import CompressText from '@/views/yugioh/components/CompressText';
  import { numberToFull } from '@/views/yugioh/yugioh';

  export default {
    name: 'YugiohCard',
    components: {
      CompressText,
    },
    props: ['data', 'refreshKey'],
    data() {
      return {
        lastDescriptionHeight: 300, // 最后一行效果压缩高度
      };
    },
    methods: {
      numberToFull,
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
      },
    },
    computed: {
      ...mapState(['staticURL']),
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
          transform: `scale(${this.data.scale})`,
          background: background,
          borderRadius: this.data.radius ? '24px' : '',
          marginRight: `${(this.data.scale - 1) * 1394}px`,
          marginBottom: `${(this.data.scale - 1) * 2031}px`,
          '--descriptionZoom': this.data.descriptionZoom,
        };
      },
      autoNameColor() {
        let color = 'black';
        // 自动颜色
        if ((this.data.type === 'monster' && ['xyz', 'link'].includes(this.data.cardType)) || ['spell', 'trap'].includes(this.data.type) ||
          (this.data.type === 'pendulum' && ['xyz-pendulum', 'link-pendulum'].includes(this.data.pendulumType))) {
          color = 'white';
        }
        return color;
      },
      nameStyle() {
        return {
          textAlign: this.data.align || 'left',
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
        } else if (this.data.language === 'astral') {
          suffix = '-astral';
        }
        if (['monster', 'pendulum'].includes(this.data.type)) {
          if (!this.data.attribute) {
            return '';
          }
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
        } else if (this.data.language === 'astral') {
          if (this.data.type === 'spell') {
            name = 'マホウカアド';
          } else if (this.data.type === 'trap') {
            name = 'トラププカアド';
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
          right = '147px';
        } else {
          right = '101px';
        }
        return {
          right: right,
        };
      },
      rankStyle() {
        let left;
        if (this.data.rank < 13) {
          left = '147px';
        } else {
          left = '101px';
        }
        return {
          left: left,
        };
      },
      imageStyle() {
        let left, top, width, height;
        if (this.data.type === 'pendulum') {
          left = '94px';
          top = '366px';
          width = '1206px';
          height = '1206px';
        } else {
          left = '171px';
          top = '376px';
          width = '1052px';
          height = '1052px';
        }
        return {
          left: left,
          top: top,
          width: width,
          height: height,
        };
      },
      leftPendulumStyle() {
        let top, left, fontSize, fontFamily, letterSpacing;
        if (this.data.language === 'astral') {
          top = '1385px';
          left = '86px';
          fontSize = '84px';
          fontFamily = 'ygo-astral, serif';
          letterSpacing = '';
        } else {
          top = '1379px';
          left = '83px';
          fontSize = '98px';
          fontFamily = 'ygo-atk-def, serif';
          letterSpacing = '-10px';
        }
        return {
          top,
          left,
          fontSize,
          fontFamily,
          letterSpacing,
        };
      },
      rightPendulumStyle() {
        let top, right, fontSize, fontFamily, letterSpacing;
        if (this.data.language === 'astral') {
          top = '1385px';
          right = '86px';
          fontSize = '84px';
          fontFamily = 'ygo-astral, serif';
          letterSpacing = '';
        } else {
          top = '1379px';
          right = '94px';
          fontSize = '98px';
          fontFamily = 'ygo-atk-def, serif';
          letterSpacing = '-10px';
        }
        return {
          top,
          right,
          fontSize,
          fontFamily,
          letterSpacing,
        };
      },
      packageStyle() {
        let top, left, right;
        if (this.data.type === 'pendulum') {
          top = '1859px';
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
          right: right,
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
          fontFamily: fontFamily,
        };
      },
      atkStyle() {
        let top, right, fontFamily, fontSize, letterSpacing;
        if (this.data.language === 'astral') {
          top = '1847px';
          right = '496px';
          fontFamily = 'ygo-astral, serif';
          fontSize = '49px';
          letterSpacing = '0';
        } else {
          top = '1844px';
          right = '397px';
          fontFamily = 'ygo-atk-def, serif';
          fontSize = '62px';
          letterSpacing = '2px';
        }
        return {
          top,
          right,
          fontFamily,
          fontSize,
          letterSpacing,
        };
      },
      defStyle() {
        let top, right, fontFamily, fontSize, letterSpacing;
        if (this.data.language === 'astral') {
          top = '1847px';
          right = '115px';
          fontFamily = 'ygo-astral, serif';
          fontSize = '49px';
          letterSpacing = '0';
        } else {
          top = '1844px';
          right = '114px';
          fontFamily = 'ygo-atk-def, serif';
          fontSize = '62px';
          letterSpacing = '2px';
        }
        return {
          top,
          right,
          fontFamily,
          fontSize,
          letterSpacing,
        };
      },
      linkStyle() {
        let top, right, fontFamily, fontSize, letterSpacing, transform;
        if (this.data.language === 'astral') {
          top = '1847px';
          right = '115px';
          fontFamily = 'ygo-astral, serif';
          fontSize = '49px';
          letterSpacing = '0';
          transform = '';
        } else {
          top = '1854px';
          right = '120px';
          fontFamily = 'ygo-link, serif';
          fontSize = '44px';
          letterSpacing = '2px';
          transform = 'scaleX(1.3)';
        }
        return {
          top,
          right,
          fontFamily,
          fontSize,
          letterSpacing,
          transform,
        };
      },
      passwordStyle() {
        return {
          color: this.data.type === 'monster' && this.data.cardType === 'xyz' ? 'white' : 'black',
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
      rareSrc() {
        const suffix = this.data.type === 'pendulum' ? '-pendulum' : '';
        return `${this.baseImage}/rare-${this.data.rare}${suffix}.png`;
      },
      rareStyle() {
        return {
          borderRadius: this.data.radius ? '24px' : '',
        };
      },
    },
    directives: {
      nameColor(el, binding) {
        const that = binding.instance;
        // 文本和注音颜色分开控制
        const autoNameColor = that.autoNameColor;
        el.style.color = binding.value || autoNameColor;
        let rtList = el.querySelectorAll('.rt');
        rtList.forEach(rt => {
          rt.style.color = autoNameColor;
        });
      },
      cardDescription(el, binding) {
        let that = binding.instance;
        that.getLastDescriptionHeight();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @use "../style/sc" as *;
  @use "../style/tc" as *;
  @use "../style/jp" as *;
  @use "../style/kr" as *;
  @use "../style/en" as *;
  @use "../style/astral" as *;

  .yugioh-card {
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

    .card-name {
      position: absolute;
      left: 116px;
      width: 1030px;
    }

    .card-attribute {
      position: absolute;
      left: 1163px;
      top: 96px;
    }

    .card-level {
      position: absolute;
      top: 247px;

      .el-image {
        margin-left: 4px;
      }
    }

    .card-rank {
      position: absolute;
      top: 247px;

      .el-image {
        margin-right: 4px;
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
          flex-direction: column;
          height: 100%;
          width: 100%;
          justify-content: center;
          align-items: center;
          font-size: 120px;
          color: var(--normal-color);
          background: white;

          .image-tip {
            font-family: var(--default-font-family);
            font-size: 28px;
            margin: 20px 0 0;
            line-height: 1.7;
          }
        }
      }
    }

    .pendulum-mask {
      position: absolute;
      left: 60px;
      top: 335px;
      z-index: 10;
    }

    .left-pendulum {
      position: absolute;
      width: 115px;
      text-align: center;
      z-index: 20;
    }

    .right-pendulum {
      position: absolute;
      width: 115px;
      text-align: center;
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
      width: 1175px;
      text-align: justify;
      z-index: 20;
    }

    .atk-def-link {
      position: absolute;
      left: 109px;
      top: 1844px;
      z-index: 20;
    }

    .card-atk {
      position: absolute;
      z-index: 20;
    }

    .card-def {
      position: absolute;
      z-index: 20;
    }

    .card-link {
      position: absolute;
      transform-origin: 50% 50%;
      z-index: 20;
    }

    .card-password {
      position: absolute;
      left: 66px;
      top: 1932px;
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

    .card-rare {
      position: absolute;
      mix-blend-mode: lighten;
      top: 0;
      left: 0;
      width: 1394px;
      height: 2031px;
      z-index: 100;
      overflow: hidden;
    }

    &.card-back {
      * {
        display: none;
      }
    }
  }
</style>
