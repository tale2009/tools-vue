<template>
  <div
    class="rush-duel-card notranslate"
    :class="cardClass"
    :style="cardStyle"
    ondragstart="return false"
  >
    <div v-name-color="data.color" class="card-name">
      <CompressText
        :text="data.name"
        :refresh-key="refreshKey"
        :width="attributeSrc ? 1025 : 1248"
        :height="200"
      />
    </div>

    <div v-if="attributeSrc" class="card-attribute">
      <el-image :src="attributeSrc" />
    </div>

    <div v-if="showLevel" class="card-level">
      <el-image :src="baseImage + '/level.png'" />
      <span class="level-number">{{ data.level }}</span>
      <span class="level-number-stroke">{{ data.level }}</span>
    </div>

    <div v-if="['spell','trap'].includes(data.type)" class="spell-trap">
      <span>【</span>
      <CompressText :text="spellTrapName" :refresh-key="refreshKey" />
      <el-image v-if="data.icon" class="spell-trap-icon" :src="`${baseImage}/icon-${data.icon}.png`" />
      <span>】</span>
    </div>

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

    <div class="card-mask">
      <el-image :src="cardMaskSrc" fit="cover" />
    </div>

    <div class="card-package">
      <span>{{ data.package }}</span>
    </div>

    <div v-if="data.type === 'monster' && data.monsterType" class="card-effect">
      <CompressText
        :text="monsterType"
        :refresh-key="refreshKey"
        :width="1196"
        :height="100"
      />
    </div>

    <div v-card-description class="card-description">
      <template v-for="(item,index) in data.description.split('\n')">
        <!--判断首行是否压缩-->
        <div v-if="index === 0 && data.firstLineCompress">
          <CompressText
            :text="item"
            :width="1196"
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
            :width="1196"
            :height="lastDescriptionHeight"
            :refresh-key="refreshKey"
            :language="data.language"
          />
        </div>
        <!--item为空提供换行-->
        <br v-if="!item">
      </template>
    </div>

    <div v-if="data.type === 'monster' && data.maximumAtk" class="maximum-atk">
      <el-image :src="baseImage + '/maximum-atk.png'" />
      <span class="maximum-atk-number">{{ data.maximumAtk }}</span>
      <span class="maximum-atk-number-stroke">{{ data.maximumAtk }}</span>
    </div>

    <div v-if="data.type === 'monster'" class="atk-def">
      <el-image :src="baseImage + '/atk-def.png'" />
      <span class="atk-number">{{ data.atk >= 0 ? data.atk : '?' }}</span>
      <span class="atk-number-stroke">{{ data.atk >= 0 ? data.atk : '?' }}</span>
      <span class="def-number">{{ data.def >= 0 ? data.def : '?' }}</span>
      <span class="def-number-stroke">{{ data.def >= 0 ? data.def : '?' }}</span>
    </div>

    <div v-if="data.legend" class="card-legend">
      <el-image :src="baseImage + '/legend.png'" />
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
  import CompressText from '@/views/rush-duel/components/CompressText';

  export default {
    name: 'RushDuelCard',
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
      // 获取最后一行效果的压缩高度
      getLastDescriptionHeight() {
        let lastDescription = document.querySelector('.last-description');
        if (lastDescription) {
          this.lastDescriptionHeight = 340 - lastDescription.offsetTop;
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
        return `${this.staticURL}/rush-duel/image`;
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
        // 自动颜色
        return 'black';
      },
      attributeSrc() {
        let suffix = '';
        if (this.data.language === 'jp') {
          suffix = '-jp';
        }
        if (this.data.type === 'monster') {
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
          if (this.data.icon === 'equip') {
            name += '/装备';
          } else if (this.data.icon === 'filed') {
            name += '/场地';
          } else if (this.data.icon === 'quick-play') {
            name += '/速攻';
          } else if (this.data.icon === 'ritual') {
            name += '/仪式';
          } else if (this.data.icon === 'continuous') {
            name += '/永续';
          } else if (this.data.icon === 'counter') {
            name += '/反击';
          }
        } else if (this.data.language === 'jp') {
          if (this.data.type === 'spell') {
            name = '[魔(ま)][法(ほう)]カード';
          } else if (this.data.type === 'trap') {
            name = '[罠(トラップ)]カード';
          }
          if (this.data.icon === 'equip') {
            name += '／[装(そう)][備(び)]';
          } else if (this.data.icon === 'filed') {
            name += '／フィールド';
          } else if (this.data.icon === 'quick-play') {
            name += '／[速(そっ)][攻(こう)]';
          } else if (this.data.icon === 'ritual') {
            name += '／[儀(ぎ)][式(しき)]';
          } else if (this.data.icon === 'continuous') {
            name += '／[永(えい)][続(ぞく)]';
          } else if (this.data.icon === 'counter') {
            name += '／カウンター';
          }
        }
        return name;
      },
      cardMaskSrc() {
        if (this.data.type === 'monster') {
          return `${this.baseImage}/card-mask-${this.data.cardType}.png`;
        } else {
          return `${this.baseImage}/card-mask-${this.data.type}.png`;
        }
      },
      showLevel() {
        return this.data.type === 'monster';
      },
      monsterType() {
        const leftBracket = '【';
        const rightBracket = '】';
        return `${leftBracket}${this.data.monsterType}${rightBracket}`;
      },
      rareSrc() {
        return `${this.baseImage}/rare-${this.data.rare}.png`;
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
  @use "../style/jp" as *;

  .rush-duel-card {
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
      left: 71px;
      width: 1030px;
    }

    .card-attribute {
      position: absolute;
      left: 1138px;
      top: 68px;
      z-index: 20;
    }

    .card-level {
      position: absolute;
      top: 1216px;
      left: 80px;
      width: 210px;
      height: 245px;
      z-index: 30;

      .level-number, .level-number-stroke {
        position: absolute;
        text-align: center;
        left: 11px; // 字体本身存在偏移
        right: 0;
        top: 76px;
        color: white;
        font-size: 116px;
        font-family: rd-atk-def, sans-serif;
        z-index: 32;
      }

      .level-number-stroke {
        z-index: 31;
        -webkit-text-stroke: 20px #D3100D;
      }
    }

    .spell-trap {
      position: absolute;
      left: 99px;
      height: 60px;
      white-space: nowrap;
      display: flex;
      align-items: center;

      .el-image {
        display: flex;
        min-width: 60px;
      }
    }

    .card-image {
      position: absolute;
      left: 73px;
      top: 200px;
      width: 1250px; // 框不是方的很无语
      height: 1258px;
      overflow: hidden;

      .el-image {
        width: 1258px;
        height: 1258px;

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

    .card-mask {
      position: absolute;
      left: 70px;
      top: 197px;
      z-index: 10;
    }

    .card-package {
      position: absolute;
      top: 1913px;
      right: 130px;
      font-family: rd-tip, sans-serif;
      font-size: 33px;
      transform: scaleX(0.9);
      transform-origin: 100% 50%;
      color: white;
      z-index: 20;
    }

    .card-effect {
      position: absolute;
      left: 99px;
      height: 60px;
      width: 1020px;
      white-space: nowrap;
      display: flex;
      align-items: center;
      z-index: 20;
    }

    .card-description {
      position: absolute;
      left: 99px;
      width: 1196px;
      text-align: justify;
      z-index: 20;
    }

    .maximum-atk {
      position: absolute;
      left: 191px;
      top: 1253px;
      width: 1038px;
      height: 96px;
      z-index: 20;

      .maximum-atk-number, .maximum-atk-number-stroke {
        position: absolute;
        text-align: right;
        right: 69px;
        top: -5px;
        color: white;
        font-size: 97px;
        font-family: rd-atk-def, sans-serif;
        letter-spacing: -6px;
        z-index: 22;
      }

      .maximum-atk-number-stroke {
        z-index: 21;
        -webkit-text-stroke: 6px black;
      }
    }

    .atk-def {
      position: absolute;
      left: 186px;
      top: 1355px;
      width: 1134px;
      height: 96px;
      z-index: 20;

      .atk-number, .atk-number-stroke {
        position: absolute;
        text-align: right;
        right: 588px;
        top: -5px;
        color: white;
        font-size: 97px;
        font-family: rd-atk-def, sans-serif;
        letter-spacing: -6px;
        z-index: 22;
      }

      .atk-number-stroke {
        z-index: 21;
        -webkit-text-stroke: 6px black;
      }

      .def-number, .def-number-stroke {
        position: absolute;
        text-align: right;
        right: 160px;
        top: -5px;
        color: white;
        font-size: 97px;
        font-family: rd-atk-def, sans-serif;
        letter-spacing: -6px;
        z-index: 22;
      }

      .def-number-stroke {
        z-index: 21;
        -webkit-text-stroke: 6px black;
      }
    }

    .card-legend {
      position: absolute;
      left: 84px;
      top: 210px;
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
