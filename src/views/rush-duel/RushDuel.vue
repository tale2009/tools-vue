<template>
  <div class="rush-duel-container">
    <Page>
      <template #default>
        <div v-if="fontLoading" class="font-loading">
          <el-alert
            title="字体加载中..."
            effect="dark"
            center
            :closable="false"
          />
        </div>
        <RushDuelCard :data="form" :refresh-key="refreshKey" />
      </template>

      <template #form>
        <PageForm description="最大尺寸 1394 px * 2031 px，卡模素材 by 白羽幸鳥">
          <template #title>
            <span>游戏王超速决斗</span>
            <el-tooltip :content="`数据库同步时间：${formatTime(config.updateTime)}`" placement="top">
              <el-icon style="margin-left: 5px" :size="18">
                <info-filled />
              </el-icon>
            </el-tooltip>
          </template>

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
                fit-input-width
                placeholder="请输入卡名"
                @select="selectCardName"
              />
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker v-model="form.color" />
              <span class="tip">（自动选择清空）</span>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="form.type" @change="changeType">
                <el-radio-button label="monster">怪兽</el-radio-button>
                <el-radio-button label="spell">魔法</el-radio-button>
                <el-radio-button label="trap">陷阱</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.type === 'monster'" label="属性">
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
            <el-form-item v-if="form.type === 'monster'" label="种族">
              <el-input v-model="form.monsterType" placeholder="请输入种族" />
            </el-form-item>
            <el-form-item v-if="form.type === 'monster'" label="MAX">
              <el-input-number
                v-model="form.maximumAtk"
                :min="0"
                :max="9999"
                :precision="0"
              />
              <span class="tip">（MAXIMUM ATK）</span>
            </el-form-item>
            <el-form-item v-if="form.type === 'monster'" label="ATK">
              <el-input-number
                v-model="form.atk"
                :min="-1"
                :max="9999"
                :precision="0"
              />
              <span class="tip">（?：-1）</span>
            </el-form-item>
            <el-form-item v-if="form.type === 'monster'" label="DEF">
              <el-input-number
                v-model="form.def"
                :min="-1"
                :max="9999"
                :precision="0"
              />
              <span class="tip">（?：-1）</span>
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
                <el-button
                  style="margin-left: 10px;flex-shrink: 0"
                  type="primary"
                  :disabled="form.language !== 'sc'"
                  @click="searchCardByPassword('')"
                >
                  <span>搜索</span>
                </el-button>
                <el-tooltip content="仅分享搜索结果" placement="top">
                  <el-button
                    style="margin-left: 10px;flex-shrink: 0"
                    type="success"
                    :disabled="form.language !== 'sc'"
                    @click="shareCard"
                  >
                    分享
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="罕贵">
              <el-select
                v-model="form.rare"
                placeholder="请选择罕贵"
                clearable
              >
                <el-option label="SR" value="sr" />
                <el-option label="RR" value="rr" />
                <el-option label="PSER" value="pser" />
              </el-select>
            </el-form-item>
            <el-form-item label="角标">
              <el-select
                v-model="form.laser"
                placeholder="请选择角标"
                clearable
              >
                <el-option label="样式一" value="laser1" />
                <el-option label="样式二" value="laser2" />
                <el-option label="样式三" value="laser3" />
                <el-option label="样式四" value="laser4" />
              </el-select>
            </el-form-item>
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="圆角">
                  <el-switch v-model="form.radius" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="传说">
                  <el-switch v-model="form.legend" />
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
                  :disabled="form.language !== 'sc'"
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
              <el-col v-if="isAdmin || isMember" :span="24">
                <el-button
                  type="primary"
                  :disabled="form.language !== 'sc'"
                  :loading="exportLoading"
                  @click="batchExportDialog = true"
                >
                  批量导出图片
                </el-button>
              </el-col>
            </el-row>
          </div>

          <KanjiKanaDialog v-model="kanjiKanaDialog" />
          <CropperDialog
            v-model="cropperDialog"
            :image="cropperImage"
            :aspect-ratio="1"
            @get-data="setImage"
          />
          <BatchExportDialog
            v-model="batchExportDialog"
            v-model:password="form.password"
            :font-loading="fontLoading"
            :search-card-by-password="searchCardByPassword"
            :export-image="exportImage"
          />
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/page/Page';
  import PageForm from '@/components/page/PageForm';
  import RushDuelCard from '@/views/rush-duel/components/RushDuelCard';
  import KanjiKanaDialog from '@/views/yugioh/components/KanjiKanaDialog';
  import CropperDialog from '@/components/dialog/CropperDialog';
  import BatchExportDialog from '@/views/yugioh/components/BatchExportDialog';
  import scDemo from '@/views/rush-duel/demo/sc-demo';
  import jpDemo from '@/views/rush-duel/demo/jp-demo';
  import loadImage from 'blueimp-load-image';
  import { InfoFilled } from '@element-plus/icons-vue';
  import { nextTick } from 'vue';
  import html2canvas from '@/views/yugioh/html2canvas';
  import { parseRushDuelCard } from '@/views/rush-duel/rush-duel';
  import { mapState } from 'vuex';

  export default {
    name: 'RushDuel',
    components: {
      Page,
      PageForm,
      RushDuelCard,
      KanjiKanaDialog,
      CropperDialog,
      BatchExportDialog,
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
          type: 'monster',
          attribute: 'dark',
          icon: '',
          image: '',
          cardType: 'normal',
          level: 0,
          monsterType: '',
          maximumAtk: 0,
          atk: 0,
          def: 0,
          description: '',
          firstLineCompress: false,
          descriptionZoom: 1,
          package: '',
          password: '',
          legend: false,
          laser: '',
          rare: '',
          radius: true,
          scale: 0.5,
        },
        languageList: [
          { label: '简体中文', value: 'sc' },
          { label: '日文', value: 'jp' },
        ],
        cropperImage: '',
        kanjiKanaDialog: false,
        cropperDialog: false,
        batchExportDialog: false,
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
          url: '/rush-duel/config',
        }).then(res => {
          this.config = res.data;
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
        } else if (value === 'jp') {
          Object.assign(this.form, jpDemo);
        }
        this.refreshFont();
      },
      changeType() {
        this.refreshKey++;
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
      changeDescriptionZoom() {
        this.refreshKey++;
      },
      fetchCardName(value, callback) {
        if (this.form.language !== 'sc') {
          callback([]);
          return;
        }
        if (value) {
          this.axios({
            method: 'get',
            url: '/rush-duel/card',
            params: {
              name: this.cardName,
              lang: this.form.language,
            },
          }).then(res => {
            let data = res.data;
            data.forEach(value => {
              value.value = `${value.name}（${value.id}）`;
            });
            callback(data);
          });
        } else {
          callback([]);
        }
      },
      selectCardName(value) {
        this.form.name = value.name;
        this.form.password = value.id;
        this.searchCardByPassword();
      },
      searchCardByPassword(lang) {
        return this.axios({
          method: 'get',
          url: '/rush-duel/card/' + this.form.password,
          params: {
            lang: lang || this.form.language,
          },
        }).then(res => {
          if (lang) {
            this.form.language = lang;
            this.refreshFont();
          }
          let cardInfo = parseRushDuelCard(res.data, this.form.language);
          Object.assign(this.form, cardInfo);
        });
      },
      getRandomCard() {
        this.randomLoading = true;
        this.axios({
          method: 'get',
          url: '/rush-duel/random-card',
          params: {
            lang: this.form.language,
          },
        }).then(res => {
          let cardInfo = parseRushDuelCard(res.data, this.form.language);
          Object.assign(this.form, cardInfo);
        }).finally(() => {
          this.randomLoading = false;
        });
      },
      shareCard() {
        const { href } = this.$router.resolve({
          path: '/share/rush-duel',
          query: {
            language: this.form.language,
            color: this.form.color,
            descriptionZoom: this.form.descriptionZoom,
            password: this.form.password,
            copyright: this.form.copyright,
            laser: this.form.laser,
            rare: this.form.rare,
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
        return new Promise(resolve => {
          nextTick(() => {
            this.exportLoading = true;
            let element = document.querySelector('.rush-duel-card');
            html2canvas(element, {
              useCORS: true,
              backgroundColor: 'transparent',
              width: this.form.scale * 1394,
              height: this.form.scale * 2031,
            }).then(canvas => {
              canvas.toBlob(blob => {
                this.downloadBlob(blob, this.cardName);
                resolve();
              });
            }).finally(() => {
              this.exportLoading = false;
            });
          });
        });
      },
    },
    computed: {
      ...mapState(['isAdmin', 'isMember']),
      showLevel() {
        let flag = false;
        if (this.form.type === 'monster') {
          flag = ['normal', 'effect', 'fusion'].includes(this.form.cardType);
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
  .rush-duel-container {
    .page-main {
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

    .form-main {
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
