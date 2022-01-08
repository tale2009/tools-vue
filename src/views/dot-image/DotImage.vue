<template>
  <div class="dot-image-container">
    <Page>
      <template #default>
        <div class="dot-image">
          <canvas ref="canvas" />
        </div>
      </template>

      <template #form>
        <PageForm title="点阵图生成器">
          <el-form :model="form" label-width="auto">
            <el-form-item label="图片">
              <el-upload
                action="/"
                :show-file-list="false"
                accept="image/*"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="像素">
              <el-input-number
                v-model="form.pixel"
                :min="1"
                :max="128"
                :precision="0"
                @change="createDotList"
              />
              <span class="tip">（长边）</span>
            </el-form-item>
            <el-form-item label="形状">
              <el-radio-group v-model="form.shape">
                <el-radio-button label="square">方形</el-radio-button>
                <el-radio-button label="round">圆形</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="黑白">
              <el-switch v-model="form.monochrome" />
            </el-form-item>
            <el-form-item label="网格">
              <el-switch v-model="form.grid" />
            </el-form-item>
            <el-form-item label="缩放">
              <el-slider v-model="form.size" :min="1" :max="30" />
            </el-form-item>
          </el-form>

          <el-button style="width: 100%" type="primary" @click="exportImage">导出图片</el-button>
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/page/Page';
  import PageForm from '@/components/page/PageForm';
  import loadImage from 'blueimp-load-image';
  import html2canvas from 'html2canvas';
  import myAvatar from '@/assets/image/my-avatar.jpg';

  export default {
    name: 'DotImage',
    components: {
      Page,
      PageForm,
    },
    data() {
      return {
        form: {
          image: myAvatar,
          pixel: 48,
          shape: 'square',
          monochrome: false,
          grid: false,
          size: 10,
        },
        dotList: [],
      };
    },
    mounted() {
      this.createDotList();
    },
    methods: {
      createDotList() {
        let pixel = this.form.pixel;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        let img = new Image();
        img.src = this.form.image; // 指定图片的DataURL(图片的base64编码数据)
        img.onload = () => {
          let pixelX = img.width >= img.height ? pixel : Math.round(img.width * pixel / img.height);
          let pixelY = img.width >= img.height ? Math.round(img.height * pixel / img.width) : pixel;

          canvas.width = pixelX;
          canvas.height = pixelY;

          context.drawImage(img, 0, 0, pixelX, pixelY);
          let imageData = context.getImageData(0, 0, pixelX, pixelY);
          let dotList = [];
          for (let y = 0; y < pixelY; y++) {
            let rowList = [];
            for (let x = 0; x < pixelX; x++) {
              let rIndex = (y * pixelX + x) * 4;
              let gIndex = (y * pixelX + x) * 4 + 1;
              let bIndex = (y * pixelX + x) * 4 + 2;
              let aIndex = (y * pixelX + x) * 4 + 3;
              let r = imageData.data[rIndex];
              let g = imageData.data[gIndex];
              let b = imageData.data[bIndex];
              let a = imageData.data[aIndex];

              rowList.push([r, g, b, a]);
              if (x === pixelX - 1) {
                dotList.push(rowList);
              }
            }
          }
          this.dotList = dotList;
          this.renderCanvas();
        };
      },
      renderCanvas() {
        if (!this.dotList.length) {
          return;
        }

        let canvas = this.$refs.canvas;
        let context = canvas.getContext('2d');
        const lineWidth = this.form.grid ? 1 : 0;
        const pixel = this.form.size;
        canvas.width = this.dotList[0].length * pixel + lineWidth;
        canvas.height = this.dotList.length * pixel + lineWidth;
        context.lineWidth = lineWidth;
        context.strokeStyle = '#dcdfe6';

        this.dotList.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            if (this.form.monochrome) {
              let rgb = Math.round((col[0] + col[1] + col[2]) / 3);
              context.fillStyle = `rgba(${rgb},${rgb},${rgb},${col[3]})`;
            } else {
              context.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3]})`;
            }

            if (this.form.shape === 'square') {
              const x = colIndex * pixel + lineWidth / 2;
              const y = rowIndex * pixel + lineWidth / 2;
              const w = pixel;
              const h = pixel;
              context.fillRect(x, y, w, h);
              if (this.form.grid) {
                context.strokeRect(x, y, w, h);
              }
            } else if (this.form.shape === 'round') {
              const x = colIndex * pixel + pixel / 2 + lineWidth / 2;
              const y = rowIndex * pixel + pixel / 2 + lineWidth / 2;
              const radius = pixel / 2;
              const startAngle = 0;
              const endAngle = Math.PI * 2;
              context.beginPath();
              context.arc(x, y, radius, startAngle, endAngle);
              context.fill();
              if (this.form.grid) {
                context.stroke();
              }
            }
          });
        });
      },
      beforeUpload(file) {
        let flag = file.type.includes('image');
        if (flag) {
          loadImage(file, {
            canvas: true,
          }).then(data => {
            this.form.image = data.image.toDataURL('image/png', 1);
            this.createDotList();
          });
        } else {
          this.$message.warning('请选择正确图片格式');
        }
        return false;
      },
      exportImage() {
        let element = document.querySelector('.dot-image');
        html2canvas(element, {
          backgroundColor: 'transparent',
        }).then(canvas => {
          canvas.toBlob(blob => {
            this.downloadBlob(blob, '点阵图');
          });
        });
      },
    },
    watch: {
      form: {
        handler() {
          this.renderCanvas();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dot-image-container {
    .dot-image {
      display: inline-flex;
      flex-wrap: wrap;
      vertical-align: top;
    }
  }
</style>
