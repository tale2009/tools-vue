<template>
  <div class="field-center-container">
    <Page>
      <template #default>
        <FieldCenterCard ref="fieldCenterCard" :data="form" />
      </template>

      <template #form>
        <PageForm title="游戏王场地中心卡" description="最大尺寸 1488 px * 2079 px，卡模素材 by 白羽幸鳥">
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
          <el-row :gutter="gutter">
            <el-col :span="12">
              <el-form-item label="圆角">
                <el-switch v-model="form.radius" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
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

          <CropperDialog
            v-model="cropperDialog"
            :image="cropperImage"
            :aspect-ratio="1308 / 1907"
            @get-data="setImage"
          />
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/render/components/page/Page';
  import PageForm from '@/render/components/page/PageForm';
  import FieldCenterCard from '@/render/views/field-center/components/FieldCenterCard';
  import CropperDialog from '@/render/components/dialog/CropperDialog';
  import loadImage from 'blueimp-load-image';
  import FiledCenter from '@/render/assets/image/field-center.jpg';
  import { nextTick } from 'vue';
  import html2canvas from '@/render/views/yugioh/html2canvas';

  export default {
    name: 'FieldCenter',
    components: {
      Page,
      PageForm,
      FieldCenterCard,
      CropperDialog,
    },
    data() {
      return {
        gutter: 10,
        exportLoading: false,
        form: {
          image: FiledCenter,
          radius: true,
          cardBack: false,
          scale: 0.5,
        },
        cropperImage: '',
        cropperDialog: false,
      };
    },
    methods: {
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
      exportImage() {
        nextTick(() => {
          this.exportLoading = true;
          let element = this.$refs.fieldCenterCard.$refs.fieldCenterCard;
          html2canvas(element, {
            useCORS: true,
            backgroundColor: 'transparent',
            width: this.form.scale * 1488,
            height: this.form.scale * 2079,
          }).then(canvas => {
            canvas.toBlob(blob => {
              this.downloadBlob(blob, '场地中心卡');
            });
          }).finally(() => {
            this.exportLoading = false;
          });
        });
      },
    },
    watch: {
      // 图片转base64
      'form.image'() {
        if (this.form.image && !this.form.image.startsWith('data:image')) {
          loadImage(this.form.image, {
            canvas: true,
            top: 0,
            aspectRatio: 1308 / 1907,
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
  .field-center-container {
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
