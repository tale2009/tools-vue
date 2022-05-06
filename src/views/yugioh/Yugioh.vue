<template>
  <div class="yugioh-container">
    <Page>
      <template #default>
        <YugiohCard :data="form" :refresh-key="refreshKey" />
      </template>

      <template #form>
        <PageForm description="最大尺寸 1393 px * 2031 px，卡模素材 by 怀特索尔">
          <template #title>
            <span>游戏王卡片生成器</span>
            <el-tooltip :content="`数据库同步时间：${formatTime(config.updateTime)}`" placement="top">
              <el-icon style="margin-left: 5px" :size="18">
                <info-filled />
              </el-icon>
            </el-tooltip>
          </template>

          <div v-if="fontLoading" class="font-loading">
            <el-progress
              :percentage="100"
              text-inside
              :stroke-width="16"
              indeterminate
            >
              <span>字体加载中...</span>
            </el-progress>
          </div>

          <el-form :model="form" label-width="auto">
            <el-form-item label="语言">
              <el-select v-model="form.language" placeholder="请选择语言" @change="changeLanguage">
                <el-option v-for="item in languageList" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="卡名">
              <el-autocomplete
                v-model="form.name"
                :fetch-suggestions="fetchCardName"
                placeholder="请输入卡名"
                @select="selectCardName"
              />
            </el-form-item>
            <el-form-item label="颜色">
              <el-tooltip content="暂不支持导出" placement="top">
                <el-switch v-model="form.gradient" active-text="渐变色" />
              </el-tooltip>
              <div v-if="form.gradient" style="width: 100%;margin-top: 10px">
                <el-row :gutter="gutter">
                  <el-col :span="8">
                    <el-space :size="10" wrap>
                      <el-color-picker v-model="form.gradientColor1" />
                      <el-color-picker v-model="form.gradientColor2" />
                    </el-space>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item style="margin-bottom: 0" label="预设">
                      <el-select
                        v-model="form.gradientPreset"
                        placeholder="请选择预设"
                        clearable
                        @change="changeGradientPreset"
                      >
                        <el-option v-for="item in gradientList" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-else style="width: 100%;margin-top: 10px">
                <el-color-picker v-model="form.color" />
                <span class="tip">（自动选择清空）</span>
              </div>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="form.type" @change="changeType">
                <el-radio-button label="monster">怪兽</el-radio-button>
                <el-radio-button label="spell">魔法</el-radio-button>
                <el-radio-button label="trap">陷阱</el-radio-button>
                <el-radio-button label="pendulum">灵摆</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="['monster','pendulum'].includes(form.type)" label="属性">
              <el-radio-group v-model="form.attribute" class="attribute-radio-group">
                <el-radio-button label="dark">暗</el-radio-button>
                <el-radio-button label="light">光</el-radio-button>
                <el-radio-button label="earth">地</el-radio-button>
                <el-radio-button label="water">水</el-radio-button>
                <el-radio-button label="fire">炎</el-radio-button>
                <el-radio-button label="wind">风</el-radio-button>
                <el-radio-button label="divine">神</el-radio-button>
                <el-radio-button label="">无</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="['spell','trap'].includes(form.type)" label="图标">
              <el-select v-model="form.icon" placeholder="请选择图标" clearable>
                <el-option label="装备" value="equip" />
                <el-option label="场地" value="filed" />
                <el-option label="速攻" value="quick-play" />
                <el-option label="仪式" value="ritual" />
                <el-option label="永续" value="continuous" />
                <el-option label="反击" value="counter" />
              </el-select>
            </el-form-item>
            <el-form-item label="图片">
              <el-space :size="10">
                <el-upload
                  action="/"
                  :show-file-list="false"
                  accept="image/*"
                  :before-upload="beforeUpload"
                >
                  <el-button type="primary">选择图片</el-button>
                </el-upload>
                <el-button plain @click="deleteImage">删除</el-button>
              </el-space>
            </el-form-item>
            <el-form-item v-if="form.type === 'monster'" label="卡类">
              <el-select v-model="form.cardType" placeholder="请选择卡类">
                <el-option label="通常" value="normal" />
                <el-option label="效果" value="effect" />
                <el-option label="仪式" value="ritual" />
                <el-option label="融合" value="fusion" />
                <el-option label="同调" value="synchro" />
                <el-option label="超量" value="xyz" />
                <el-option label="连接" value="link" />
                <el-option label="衍生物" value="token" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.type === 'pendulum'" label="灵摆">
              <el-select v-model="form.pendulumType" placeholder="请选择灵摆">
                <el-option label="通常 / 灵摆" value="normal-pendulum" />
                <el-option label="效果 / 灵摆" value="effect-pendulum" />
                <el-option label="仪式 / 灵摆" value="ritual-pendulum" />
                <el-option label="融合 / 灵摆" value="fusion-pendulum" />
                <el-option label="同调 / 灵摆" value="synchro-pendulum" />
                <el-option label="超量 / 灵摆" value="xyz-pendulum" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showLevel" label="星级">
              <el-input-number
                v-model="form.level"
                :min="0"
                :max="13"
                :precision="0"
              />
            </el-form-item>
            <el-form-item v-if="showRank" label="阶级">
              <el-input-number
                v-model="form.rank"
                :min="0"
                :max="13"
                :precision="0"
              />
            </el-form-item>
            <el-form-item v-if="form.type === 'pendulum'" label="刻度">
              <el-input-number
                v-model="form.pendulumScale"
                :min="0"
                :max="13"
                :precision="0"
              />
            </el-form-item>
            <el-form-item v-if="form.type === 'pendulum'" label="灵摆效果" label-width="40px">
              <el-input
                v-model="form.pendulumDescription"
                type="textarea"
                :autosize="{minRows: 3}"
                placeholder="请输入灵摆效果"
                @input="inputPendulumDescription"
              />
            </el-form-item>
            <el-form-item v-if="['monster','pendulum'].includes(form.type)" label="种族">
              <el-input v-model="form.monsterType" placeholder="请输入种族" />
            </el-form-item>
            <el-form-item v-if="['monster','pendulum'].includes(form.type)" label="ATK">
              <el-input-number
                v-model="form.atk"
                :min="-1"
                :max="9999"
                :precision="0"
              />
              <span class="tip">（? 输入 -1）</span>
            </el-form-item>
            <el-form-item v-if="(form.type === 'monster' && form.cardType!=='link') || form.type === 'pendulum'" label="DEF">
              <el-input-number
                v-model="form.def"
                :min="-1"
                :max="9999"
                :precision="0"
              />
              <span class="tip">（? 输入 -1）</span>
            </el-form-item>
            <el-form-item v-if="form.type === 'monster' && form.cardType === 'link'" label="箭头">
              <div class="arrow-form">
                <div
                  v-for="item in [8,1,2,7,9,3,6,5,4]"
                  class="arrow-item"
                  :style="arrowItemStyle(item)"
                  @click="toggleArrow(item)"
                >
                  <i v-if="item === 1" class="fa-solid fa-up" />
                  <i v-if="item === 2" class="fa-solid fa-up-right" />
                  <i v-if="item === 3" class="fa-solid fa-right" />
                  <i v-if="item === 4" class="fa-solid fa-down-right" />
                  <i v-if="item === 5" class="fa-solid fa-down" />
                  <i v-if="item === 6" class="fa-solid fa-down-left" />
                  <i v-if="item === 7" class="fa-solid fa-left" />
                  <i v-if="item === 8" class="fa-solid fa-up-left" />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="效果">
              <el-switch v-model="form.firstLineCompress" active-text="首行压缩" />
              <el-input
                v-model="form.description"
                style="margin-top: 10px"
                type="textarea"
                :autosize="{minRows: 3}"
                placeholder="请输入效果"
              />
            </el-form-item>
            <el-form-item label="字号">
              <el-slider
                v-model="form.descriptionZoom"
                :min="1"
                :max="1.5"
                :step="0.02"
                @input="changeDescriptionZoom"
              />
            </el-form-item>
            <el-form-item label="卡包">
              <el-input v-model="form.package" placeholder="请输入卡包" />
            </el-form-item>
            <el-form-item label="密码">
              <div style="display: flex;align-items: center;flex: 1">
                <el-input v-model="form.password" placeholder="请输入密码" />
                <el-dropdown
                  style="margin-left: 10px;flex-shrink: 0"
                  type="primary"
                  split-button
                  @click="searchCardByPassword('')"
                >
                  <span>搜索</span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="item in languageList" @click="searchCardByPassword(item.value)">{{ item.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-tooltip content="仅分享搜索结果" placement="top">
                  <el-button style="margin-left: 10px;flex-shrink: 0" type="success" @click="shareCard">分享</el-button>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="版权">
              <el-select
                v-model="form.copyright"
                placeholder="请选择版权"
                clearable
                fit-input-width
              >
                <el-option label="©2020 Studio Dice/SHUEISHA, TV TOKYO, KONAMI" value="sc" />
                <el-option label="©スタジオ・ダイス/集英社・テレビ東京・KONAMI" value="jp" />
                <el-option label="©1996 KAZUKI TAKAHASHI" value="en" />
              </el-select>
            </el-form-item>
            <el-row :gutter="gutter">
              <el-col :span="8">
                <el-form-item label="角标">
                  <el-switch v-model="form.laser" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="圆角">
                  <el-switch v-model="form.radius" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="卡背">
                  <el-switch v-model="form.cardBack" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="缩放">
              <el-slider
                v-model="form.scale"
                :min="0.1"
                :max="1"
                :step="0.1"
              />
            </el-form-item>
          </el-form>

          <div class="button-group">
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-button plain @click="kanjiKanaDialog = true">一键注音</el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  plain
                  :loading="randomLoading"
                  @click="getRandomCard"
                >
                  随机生成
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-upload
                  action="/"
                  :show-file-list="false"
                  accept="application/json"
                  :before-upload="importJson"
                >
                  <el-button plain>导入数据</el-button>
                </el-upload>
              </el-col>
              <el-col :span="12">
                <el-button plain @click="exportJson">导出数据</el-button>
              </el-col>
              <el-col :span="24">
                <el-button
                  type="primary"
                  :loading="exportLoading"
                  @click="exportImage"
                >
                  导出图片
                </el-button>
              </el-col>
            </el-row>
          </div>

          <KanjiKanaDialog v-model="kanjiKanaDialog" />
          <CropperDialog v-model="cropperDialog" :image="cropperImage" @get-data="setImage" />
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/page/Page';
  import PageForm from '@/components/page/PageForm';
  import YugiohCard from '@/views/yugioh/components/YugiohCard';
  import KanjiKanaDialog from '@/views/yugioh/components/KanjiKanaDialog';
  import CropperDialog from '@/components/dialog/CropperDialog';
  import html2canvas from './html2canvas';
  import loadImage from 'blueimp-load-image';
  import { InfoFilled } from '@element-plus/icons-vue';
  import scDemo from './demo/sc-demo';
  import tcDemo from './demo/tc-demo';
  import jpDemo from './demo/jp-demo';
  import krDemo from './demo/kr-demo';
  import enDemo from './demo/en-demo';
  import { nextTick } from 'vue';

  export default {
    name: 'Yugioh',
    components: {
      Page,
      PageForm,
      YugiohCard,
      KanjiKanaDialog,
      CropperDialog,
      InfoFilled,
    },
    data() {
      return {
        gutter: 10,
        refreshKey: 0,
        fontLoading: false,
        randomLoading: false,
        exportLoading: false,
        form: {
          language: 'sc',
          name: '',
          color: '',
          gradient: false,
          gradientColor1: '#999999',
          gradientColor2: '#ffffff',
          gradientPreset: 'silver',
          type: 'monster',
          attribute: 'dark',
          icon: '',
          image: '',
          cardType: 'normal',
          pendulumType: 'normal-pendulum',
          level: 0,
          rank: 0,
          pendulumScale: 0,
          pendulumDescription: '',
          monsterType: '',
          atk: 0,
          def: 0,
          arrowList: [],
          description: '',
          firstLineCompress: false,
          descriptionZoom: 1,
          package: '',
          password: '',
          copyright: '',
          laser: false,
          radius: true,
          cardBack: false,
          scale: 0.5,
        },
        languageList: [
          { label: '简体中文', value: 'sc' },
          { label: '繁体中文', value: 'tc' },
          { label: '日文', value: 'jp' },
          { label: '韩文', value: 'kr' },
          { label: '英文', value: 'en' },
        ],
        gradientList: [
          { label: '银字', value: 'silver' },
          { label: '金字', value: 'gold' },
          { label: '红字', value: 'red' },
          { label: '白字', value: 'white' },
          { label: '黑字', value: 'black' },
          { label: '蓝字', value: 'blue' },
          { label: '绿字', value: 'green' },
        ],
        cropperImage: '',
        kanjiKanaDialog: false,
        cropperDialog: false,
        config: {},
      };
    },
    created() {
      Object.assign(this.form, scDemo);
    },
    mounted() {
      this.getConfig();
      this.refreshFont();
    },
    methods: {
      getConfig() {
        this.axios({
          method: 'get',
          url: '/yugioh/config',
        }).then(res => {
          this.config = res.data.data;
        });
      },
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
      changeLanguage(value) {
        if (value === 'sc') {
          Object.assign(this.form, scDemo);
        } else if (value === 'tc') {
          Object.assign(this.form, tcDemo);
        } else if (value === 'jp') {
          Object.assign(this.form, jpDemo);
        } else if (value === 'kr') {
          Object.assign(this.form, krDemo);
        } else if (value === 'en') {
          Object.assign(this.form, enDemo);
        }
        this.refreshFont();
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
        } else if (value === 'black') {
          this.form.gradientColor1 = '#000000';
          this.form.gradientColor2 = '#999999';
        } else if (value === 'blue') {
          this.form.gradientColor1 = '#009999';
          this.form.gradientColor2 = '#00ffff';
        } else if (value === 'green') {
          this.form.gradientColor1 = '#009900';
          this.form.gradientColor2 = '#00ff00';
        }
      },
      beforeUpload(file) {
        let flag = file.type.includes('image');
        if (flag) {
          loadImage(file, {
            canvas: true,
          }).then(data => {
            this.cropperImage = data.image.toDataURL('image/png', 1);
            this.cropperDialog = true;
          });
        } else {
          this.$message.warning('请选择正确图片格式');
        }
        return false;
      },
      setImage(image) {
        this.form.image = image;
      },
      deleteImage() {
        this.form.image = '';
      },
      inputPendulumDescription() {
        // 不保留换行符号
        if (this.form.pendulumDescription.includes('\n')) {
          this.$message.warning('不允许换行符');
          this.form.pendulumDescription = this.form.pendulumDescription.replace('\n', '');
        }
      },
      changeDescriptionZoom() {
        this.refreshKey++;
      },
      toggleArrow(item) {
        if (this.form.arrowList.includes(item)) {
          this.form.arrowList = this.form.arrowList.filter(value => value !== item);
        } else {
          this.form.arrowList.push(item);
        }
      },
      arrowItemStyle(item) {
        let border = '';
        let color = '';
        if (this.form.arrowList.includes(item)) {
          border = '1px solid darkorange';
          color = 'darkorange';
        }
        return {
          border: border,
          color: color,
          visibility: item === 9 ? 'hidden' : '',
        };
      },
      fetchCardName(value, callback) {
        if (value) {
          this.axios({
            method: 'get',
            url: '/yugioh/card',
            params: {
              name: this.cardName,
              lang: this.form.language,
            },
          }).then(res => {
            let data = res.data.data;
            data.forEach(value => {
              value.value = `${value.name}（${value.id}）`;
            });
            callback(data);
          });
        }
        callback([]);
      },
      selectCardName(value) {
        this.form.name = value.name;
        this.form.password = value.id;
        this.searchCardByPassword();
      },
      changeType() {
        this.refreshKey++;
      },
      searchCardByPassword(lang) {
        this.axios({
          method: 'get',
          url: '/yugioh/card/' + this.form.password,
          params: {
            lang: lang || this.form.language,
          },
        }).then(res => {
          if (lang) {
            this.form.language = lang;
            this.refreshFont();
          }
          let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
          Object.assign(this.form, cardInfo);
        });
      },
      getRandomCard() {
        this.randomLoading = true;
        this.axios({
          method: 'get',
          url: '/yugioh/random-card',
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
          Object.assign(this.form, cardInfo);
        }).finally(() => {
          this.randomLoading = false;
        });
      },
      shareCard() {
        const { href } = this.$router.resolve({
          path: '/share/yugioh',
          query: {
            password: this.form.password,
            language: this.form.language,
            gradient: this.form.gradient,
            gradientPreset: this.form.gradientPreset,
            radius: this.form.radius,
          },
        });
        open(href, '_blank');
      },
      importJson(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e => {
          try {
            let data = JSON.parse(e.target?.result);
            this.form = Object.assign(this.form, data);
            // 字体可能加载
            this.refreshFont();
          } catch (e) {
            this.$message.error('数据导入失败');
          }
        });
      },
      exportJson() {
        let data = JSON.stringify(this.form);
        let blob = new Blob([data], { type: 'application/json' });
        this.downloadBlob(blob, this.cardName);
      },
      exportImage() {
        if (this.form.gradient) {
          this.form.gradient = false;
          this.$message.warning('暂不支持导出渐变色卡名');
        }
        nextTick(() => {
          this.exportLoading = true;
          let element = document.querySelector('.yugioh-card');
          html2canvas(element, {
            useCORS: true,
            backgroundColor: 'transparent',
            width: this.form.scale * 1393,
            height: this.form.scale * 2031,
          }).then(canvas => {
            canvas.toBlob(blob => {
              this.downloadBlob(blob, this.cardName);
            });
          }).finally(() => {
            this.exportLoading = false;
          });
        });
      },
    },
    computed: {
      showLevel() {
        let flag = false;
        if (this.form.type === 'monster') {
          flag = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'token'].includes(this.form.cardType);
        } else if (this.form.type === 'pendulum') {
          flag = ['normal-pendulum', 'effect-pendulum', 'ritual-pendulum', 'fusion-pendulum', 'synchro-pendulum'].includes(this.form.pendulumType);
        }
        return flag;
      },
      showRank() {
        let flag = false;
        if (this.form.type === 'monster') {
          flag = this.form.cardType === 'xyz';
        } else if (this.form.type === 'pendulum') {
          flag = this.form.pendulumType === 'xyz-pendulum';
        }
        return flag;
      },
      cardName() {
        return this.form.name.replace(/\[(.*?)\(.*?\)]/g, '$1');
      },
    },
    watch: {
      // 图片转base64
      'form.image'() {
        if (this.form.image && !this.form.image.startsWith('data:image')) {
          loadImage(this.form.image, {
            canvas: true,
            top: 0,
            aspectRatio: 1,
            crossOrigin: 'Anonymous',
          }).then(data => {
            this.form.image = data.image.toDataURL('image/png', 1);
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .yugioh-container {
    .form-main {
      .font-loading {
        margin-bottom: 20px;
      }

      .arrow-form {
        width: 130px;
        display: flex;
        flex-wrap: wrap;
        margin-right: -10px;
        margin-bottom: -10px;

        .arrow-item {
          width: 32px;
          height: 32px;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: var(--placeholder-color);
          font-size: 18px;
        }
      }

      .attribute-radio-group {
        ::v-deep(.el-radio-button__inner) {
          padding: 8px 11px;
        }
      }

      .button-group {
        .el-row {
          margin-top: -20px;

          .el-col {
            margin-top: 20px;

            ::v-deep(.el-upload) {
              width: 100%;
            }

            .el-button {
              width: 100%;
            }
          }
        }
      }
    }
  }

</style>
