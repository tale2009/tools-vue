<template>
  <div class="yugioh-back-container">
    <Page>
      <template #default>
        <YugiohBackCard :data="form" />
      </template>

      <template #form>
        <PageForm title="游戏王卡背" description="最大尺寸 1394 px * 2031 px，卡模素材 by 白羽幸鳥">
          <el-form :model="form" label-width="auto">
            <el-form-item label="类型">
              <el-select
                v-model="form.type"
                placeholder="请选择类型"
              >
                <el-option label="通常" value="normal" />
                <el-option label="巨神兵" value="tormentor" />
                <el-option label="天空龙" value="sky-dragon" />
                <el-option label="翼神龙" value="winged-dragon" />
              </el-select>
            </el-form-item>
            <el-form-item label="标志">
              <el-select
                v-model="form.logo"
                placeholder="请选择标志"
                clearable
              >
                <el-option label="OCG" value="ocg" />
                <el-option label="TCG" value="tcg" />
                <el-option label="RD" value="rd" />
              </el-select>
            </el-form-item>
            <el-row :gutter="gutter">
              <el-col :span="8">
                <el-form-item label="圆角">
                  <el-switch v-model="form.radius" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="K标">
                  <el-switch v-model="form.konami" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="R标">
                  <el-switch v-model="form.register" />
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
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/page/Page';
  import PageForm from '@/components/page/PageForm';
  import YugiohBackCard from '@/views/yugioh-back/components/YugiohBackCard';
  import { nextTick } from 'vue';
  import html2canvas from '@/views/yugioh/html2canvas';

  export default {
    name: 'YugiohBack',
    components: {
      Page,
      PageForm,
      YugiohBackCard,
    },
    data() {
      return {
        gutter: 10,
        exportLoading: false,
        form: {
          type: 'normal',
          logo: 'ocg',
          konami: true,
          register: true,
          radius: true,
          scale: 0.5,
        },
      };
    },
    methods: {
      exportImage() {
        nextTick(() => {
          this.exportLoading = true;
          let element = document.querySelector('.yugioh-back-card');
          html2canvas(element, {
            useCORS: true,
            backgroundColor: 'transparent',
            width: this.form.scale * 1394,
            height: this.form.scale * 2031,
          }).then(canvas => {
            canvas.toBlob(blob => {
              this.downloadBlob(blob, '游戏王卡背');
            });
          }).finally(() => {
            this.exportLoading = false;
          });
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .yugioh-back-container {
    .form-main {
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
