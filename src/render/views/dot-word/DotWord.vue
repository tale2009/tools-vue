<template>
  <div class="dot-word-container">
    <Page>
      <template #default>
        <div ref="dotWord" class="word-list" :style="wordListStyle">
          <canvas v-for="(word,index) in wordList" :ref="el => canvasRefList[index] = el" :style="canvasStyle" />
        </div>
      </template>

      <template #form>
        <PageForm title="点阵字生成器" description="16 px 宋体效果最佳">
          <el-form :model="form" label-width="auto">
            <el-form-item label="文字">
              <el-input v-model="form.text" placeholder="请输入文字" />
            </el-form-item>
            <el-form-item label="像素">
              <el-input-number
                v-model="form.pixel"
                :min="8"
                :max="64"
                :precision="0"
              />
            </el-form-item>
            <el-form-item label="字体">
              <el-select
                v-model="form.font"
                placeholder="请选择字体"
                filterable
                allow-create
              >
                <el-option v-for="item in fontList" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="基线">
              <el-radio-group v-model="form.baseline">
                <el-radio-button label="top">top</el-radio-button>
                <el-radio-button label="hanging">hanging</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="字距">
              <el-slider v-model="form.wordMargin" :min="0" :max="30" />
            </el-form-item>
            <el-form-item label="点距">
              <el-slider v-model="form.dotMargin" :min="0" :max="30" />
            </el-form-item>
            <el-form-item label="形状">
              <el-radio-group v-model="form.shape">
                <el-radio-button label="square">方形</el-radio-button>
                <el-radio-button label="round">圆形</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker v-model="form.color" />
            </el-form-item>
            <el-form-item label="灰阶">
              <el-switch v-model="form.grayscale" />
            </el-form-item>
            <el-form-item label="网格">
              <el-switch v-model="form.grid" />
            </el-form-item>
            <el-form-item v-if="!form.grayscale" label="阈值">
              <el-slider v-model="form.threshold" :min="1" :max="255" />
            </el-form-item>
            <el-form-item label="缩放">
              <el-slider v-model="form.size" :min="1" :max="30" />
            </el-form-item>
          </el-form>

          <el-button
            style="width: 100%"
            type="primary"
            @click="exportImage"
          >
            导出图片
          </el-button>
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import { nextTick } from 'vue';
  import Page from '@/render/components/page/Page';
  import PageForm from '@/render/components/page/PageForm';
  import html2canvas from 'html2canvas';

  export default {
    name: 'DotWord',
    components: {
      Page,
      PageForm,
    },
    data() {
      return {
        form: {
          text: '点阵字生成器',
          pixel: 16,
          font: '宋体',
          baseline: 'top',
          wordMargin: 5,
          dotMargin: 0,
          shape: 'square',
          color: '#000000',
          grayscale: false,
          grid: false,
          gridWidth: 1,
          threshold: 64,
          size: 10,
        },
        fontList: ['宋体', '黑体', '楷体', '仿宋', '微软雅黑'],
        wordList: [],
        canvasRefList: [],
      };
    },
    mounted() {
      this.createWordList();
    },
    methods: {
      createWordList() {
        let textList = Array.from(this.form.text);
        let pixel = this.form.pixel;
        let wordList = [];
        textList.forEach(text => {
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          let pixelX = this.isHalfWidth(text) ? Math.round(pixel / 2) : pixel;
          let pixelY = pixel;

          canvas.width = pixelX;
          canvas.height = pixelY;
          context.font = `${pixel}px ${this.form.font}`;
          context.textBaseline = this.form.baseline;
          context.fillText(text, 0, 0);
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

              rowList.push(a);
              if (x === pixelX - 1) {
                dotList.push(rowList);
              }
            }
          }
          wordList.push(dotList);
        });
        this.wordList = wordList;
        this.renderCanvas();
      },
      async renderCanvas() {
        if (!this.wordList.length) {
          return;
        }

        await nextTick();

        this.wordList.forEach((word, wordIndex) => {
          let canvas = this.canvasRefList[wordIndex];
          let context = canvas.getContext('2d');
          const lineWidth = this.form.grid ? this.form.gridWidth : 0;
          const pixel = this.form.size;
          canvas.width = word[0].length * (pixel + this.form.dotMargin) + lineWidth + this.form.wordMargin;
          canvas.height = word.length * (pixel + this.form.dotMargin) + lineWidth + this.form.wordMargin;
          context.lineWidth = lineWidth;
          context.strokeStyle = '#dcdfe6';

          word.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
              if (this.form.grayscale) {
                if (this.form.color) {
                  let r = parseInt(this.form.color.substring(1, 3), 16);
                  let g = parseInt(this.form.color.substring(3, 5), 16);
                  let b = parseInt(this.form.color.substring(5, 7), 16);
                  let a = col / 255;
                  context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                }
              } else {
                context.fillStyle = col >= this.form.threshold ? this.form.color : 'transparent';
              }

              if (this.form.shape === 'square') {
                const x = colIndex * (pixel + this.form.dotMargin) + lineWidth / 2;
                const y = rowIndex * (pixel + this.form.dotMargin) + lineWidth / 2;
                const w = pixel;
                const h = pixel;
                context.fillRect(x, y, w, h);
                if (this.form.grid) {
                  context.strokeRect(x, y, w, h);
                }
              } else if (this.form.shape === 'round') {
                const x = colIndex * (pixel + this.form.dotMargin) + pixel / 2 + lineWidth / 2;
                const y = rowIndex * (pixel + this.form.dotMargin) + pixel / 2 + lineWidth / 2;
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
        });
      },
      // 是否为半角
      isHalfWidth(item) {
        return /[\x00-\xff]/g.test(item);
      },
      exportImage() {
        let element = this.$refs.dotWord;
        html2canvas(element, {
          backgroundColor: 'transparent',
        }).then(canvas => {
          canvas.toBlob(blob => {
            this.downloadBlob(blob, this.form.text);
          });
        });
      },
    },
    computed: {
      wordListStyle() {
        return {
          paddingRight: this.form.grid ? `${this.form.gridWidth}px` : 0,
          paddingBottom: this.form.grid ? `${this.form.gridWidth}px` : 0,
        };
      },
      canvasStyle() {
        return {
          marginRight: this.form.grid ? `${-this.form.gridWidth}px` : 0,
          marginBottom: this.form.grid ? `${-this.form.gridWidth}px` : 0,
        };
      },
    },
    watch: {
      form: {
        handler() {
          this.createWordList();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dot-word-container {
    .word-list {
      display: inline-flex;
      flex-wrap: wrap;
      vertical-align: top;
    }
  }
</style>
