<template>
  <div class="pixel-art-container">
    <Page>
      <template #default>
        <div ref="pixelArt" class="pixel-art">
          <canvas ref="canvas" />
          <!--hoverCanvas用来渲染悬浮边框-->
          <canvas ref="hoverCanvas" class="hover-canvas" />
        </div>
      </template>

      <template #form>
        <PageForm title="像素画">
          <el-button-group class="form-bar">
            <el-button :disabled="!historyList.length" @click="undoHistory">
              <i class="fa-solid fa-undo" />
            </el-button>
            <el-popconfirm title="是否清空画板？" @confirm="clearPixelArt">
              <template #reference>
                <el-button type="danger">
                  <i class="fa-solid fa-trash" />
                </el-button>
              </template>
            </el-popconfirm>
          </el-button-group>

          <el-form :model="form" label-width="auto">
            <el-form-item label="宽度">
              <el-input-number
                v-model="form.widthPixel"
                :min="1"
                :max="128"
                :precision="0"
              />
              <span class="tip">（像素）</span>
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number
                v-model="form.heightPixel"
                :min="1"
                :max="128"
                :precision="0"
              />
              <span class="tip">（像素）</span>
            </el-form-item>
            <el-form-item label="工具">
              <el-space :size="10" wrap>
                <el-check-tag :checked="form.type === 'pencil'" @change="changeType('pencil')">铅笔</el-check-tag>
                <el-check-tag :checked="form.type === 'eraser'" @change="changeType('eraser')">橡皮擦</el-check-tag>
                <el-check-tag :checked="form.type === 'absorber'" @change="changeType('absorber')">吸色器</el-check-tag>
              </el-space>
            </el-form-item>
            <el-form-item label="形状">
              <el-radio-group v-model="form.shape">
                <el-radio-button label="square">方形</el-radio-button>
                <el-radio-button label="round">圆形</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker v-model="form.color" show-alpha />
            </el-form-item>
            <el-form-item label="黑白">
              <el-switch v-model="form.monochrome" />
            </el-form-item>
            <el-form-item label="网格">
              <el-switch v-model="form.grid" />
            </el-form-item>
            <el-form-item label="缩放">
              <el-slider v-model="form.size" :min="1" :max="100" />
            </el-form-item>
          </el-form>

          <div class="button-group">
            <el-row :gutter="10">
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
                <el-button type="primary" @click="exportImage">导出图片</el-button>
              </el-col>
            </el-row>
          </div>
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/render/components/page/Page';
  import PageForm from '@/render/components/page/PageForm';
  import { computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import html2canvas from 'html2canvas';
  import _ from 'lodash';
  import usePixel from './use-pixel';

  export default {
    name: 'PixelArt',
    components: {
      Page,
      PageForm,
    },
    setup() {
      const { proxy } = getCurrentInstance();
      const canvas = ref(null);
      const context = ref(null);
      const hoverCanvas = ref(null);
      const hoverContext = ref(null);
      const pixelArt = ref(null);
      let form = reactive({
        heightPixel: 16,
        widthPixel: 16,
        type: 'pencil',
        shape: 'square',
        color: 'rgba(0, 0, 0, 1)',
        monochrome: false,
        grid: true,
        size: 30,
      });
      const dotList = ref([]);
      const historyList = ref([]);
      const downDot = ref({}); // 鼠标按下的点
      const lastDot = ref({}); // 上一个移动的点
      const currentDot = ref({}); // 鼠标当前所在点
      const lineWidth = computed(() => form.grid ? 1 : 0);
      const pixel = computed(() => form.size);
      const isMousedown = ref(false);

      onMounted(() => {
        context.value = canvas.value.getContext('2d');
        hoverContext.value = hoverCanvas.value.getContext('2d');
        createDotList();
        canvas.value.addEventListener('mousemove', onMousemove);
        canvas.value.addEventListener('mouseleave', onMouseleave);
        canvas.value.addEventListener('mousedown', onMousedown);
        document.addEventListener('mouseup', onMouseup);
        addEventListener('keydown', registerShortcut);
      });

      onBeforeUnmount(() => {
        canvas.value.removeEventListener('mousemove', onMousemove);
        canvas.value.removeEventListener('mouseleave', onMouseleave);
        canvas.value.removeEventListener('mousedown', onMousedown);
        document.removeEventListener('mouseup', onMouseup);
        removeEventListener('keydown', registerShortcut);
      });

      const createDotList = () => {
        const pixelX = form.widthPixel;
        const pixelY = form.heightPixel;
        const defaultColor = [255, 255, 255, 0];

        const list = new Array(pixelY).fill(null).map(() => new Array(pixelX).fill(defaultColor));
        list.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            list[rowIndex][colIndex] = dotList.value?.[rowIndex]?.[colIndex] || col;
          });
        });
        dotList.value = list;
        renderCanvas();
      };

      const renderCanvas = () => {
        canvas.value.width = form.widthPixel * pixel.value + lineWidth.value;
        canvas.value.height = form.heightPixel * pixel.value + lineWidth.value;
        hoverCanvas.value.width = canvas.value.width;
        hoverCanvas.value.height = canvas.value.height;

        dotList.value.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            addDot(rowIndex, colIndex, col);
          });
        });
      };

      const renderHoverCanvas = () => {
        hoverContext.value.clearRect(0, 0, hoverCanvas.value.width, hoverCanvas.value.height);

        if (Object.keys(currentDot.value).length) {
          const rowIndex = currentDot.value.x;
          const colIndex = currentDot.value.y;
          hoverContext.value.lineWidth = lineWidth.value;
          hoverContext.value.fillStyle = 'rgba(64, 158, 255, 0.2)';
          hoverContext.value.strokeStyle = 'var(--primary-color)';

          if (form.shape === 'square') {
            const x = colIndex * pixel.value + lineWidth.value / 2;
            const y = rowIndex * pixel.value + lineWidth.value / 2;
            const w = pixel.value;
            const h = pixel.value;
            hoverContext.value.fillRect(x, y, w, h);
            hoverContext.value.strokeRect(x, y, w, h);
          } else if (form.shape === 'round') {
            const x = colIndex * pixel.value + pixel.value / 2 + lineWidth.value / 2;
            const y = rowIndex * pixel.value + pixel.value / 2 + lineWidth.value / 2;
            const radius = pixel.value / 2;
            const startAngle = 0;
            const endAngle = Math.PI * 2;
            hoverContext.value.beginPath();
            hoverContext.value.arc(x, y, radius, startAngle, endAngle);
            hoverContext.value.fill();
            hoverContext.value.stroke();
          }
        }
      };

      const addDot = (rowIndex, colIndex, color) => {
        context.value.clearRect(colIndex * pixel.value, rowIndex * pixel.value, pixel.value, pixel.value);
        context.value.lineWidth = lineWidth.value;
        context.value.strokeStyle = '#dcdfe6';

        if (form.monochrome) {
          let rgb = Math.round((color[0] + color[1] + color[2]) / 3);
          context.value.fillStyle = `rgba(${rgb},${rgb},${rgb},${color[3]})`;
        } else {
          context.value.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        }

        if (form.shape === 'square') {
          const x = colIndex * pixel.value + lineWidth.value / 2;
          const y = rowIndex * pixel.value + lineWidth.value / 2;
          const w = pixel.value;
          const h = pixel.value;
          context.value.fillRect(x, y, w, h);
          if (form.grid) {
            context.value.strokeRect(x, y, w, h);
          }
        } else if (form.shape === 'round') {
          const x = colIndex * pixel.value + pixel.value / 2 + lineWidth.value / 2;
          const y = rowIndex * pixel.value + pixel.value / 2 + lineWidth.value / 2;
          const radius = pixel.value / 2;
          const startAngle = 0;
          const endAngle = Math.PI * 2;
          context.value.beginPath();
          context.value.arc(x, y, radius, startAngle, endAngle);
          context.value.fill();
          if (form.grid) {
            context.value.stroke();
          }
        }
      };

      const changeType = type => {
        form.type = type;
      };

      const clearPixelArt = () => {
        dotList.value = [];
        createDotList();
      };

      const usePixelKey = {
        form,
        dotList,
        downDot,
        lastDot,
        currentDot,
        isMousedown,
        addDot,
      };

      const onMousemove = e => {
        // 算式：const x = colIndex * pixel.value + lineWidth.value;
        //       const y = rowIndex * pixel.value + lineWidth.value;
        const x = e.offsetX;
        const y = e.offsetY;
        const colIndex = Math.floor((x - lineWidth.value) / pixel.value);
        const rowIndex = Math.floor((y - lineWidth.value) / pixel.value);
        if (colIndex < 0 || rowIndex < 0) {
          return;
        }
        lastDot.value = Object.keys(currentDot.value).length ? _.cloneDeep(currentDot.value) : { x: rowIndex, y: colIndex };
        currentDot.value = { x: rowIndex, y: colIndex };
        if (!_.isEqual(lastDot.value, currentDot.value)) {
          usePixel(usePixelKey, form.type);
        }
      };

      const onMouseleave = () => {
        currentDot.value = {};
      };

      const onMousedown = () => {
        isMousedown.value = true;
        downDot.value = _.cloneDeep(currentDot.value);
        saveHistory();
        usePixel(usePixelKey, form.type);

        document.onselectstart = () => false;
        document.ondragstart = () => false;
      };

      const onMouseup = () => {
        isMousedown.value = false;

        document.onselectstart = null;
        document.ondragstart = null;
      };

      const saveHistory = () => {
        historyList.value.push(_.cloneDeep(dotList.value));
      };

      const undoHistory = () => {
        const history = historyList.value.pop();
        if (history) {
          dotList.value = history;
          createDotList();
        }
      };

      const registerShortcut = e => {
        if (document.activeElement.nodeName === 'INPUT') {
          return;
        }

        const { ctrlKey, key } = e;
        if (ctrlKey && key === 'z') {
          undoHistory();
          e.preventDefault();
        }
      };

      const importJson = file => {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e => {
          try {
            let data = JSON.parse(e.target?.result);
            form = Object.assign(form, data.form);
            dotList.value = data.dotList;
            createDotList();
          } catch (e) {
            this.$message.error('数据导入失败');
          }
        });
      };
      const exportJson = () => {
        let data = JSON.stringify({
          form,
          dotList: dotList.value,
        });
        let blob = new Blob([data], { type: 'application/json' });
        proxy.downloadBlob(blob, '像素画');
      };

      const exportImage = () => {
        let element = pixelArt.value;
        html2canvas(element, {
          backgroundColor: 'transparent',
        }).then(canvas => {
          canvas.toBlob(blob => {
            proxy.downloadBlob(blob, '像素画');
          });
        });
      };

      watch(() => {
        const { heightPixel, widthPixel, shape, monochrome, grid, size } = form;
        return { heightPixel, widthPixel, shape, monochrome, grid, size };
      }, () => {
        createDotList();
      });

      watch(currentDot, (newVal, oldVal) => {
        if (!_.isEqual(newVal, oldVal)) {
          renderHoverCanvas();
        }
      });

      return {
        canvas,
        context,
        hoverCanvas,
        hoverContext,
        pixelArt,
        form,
        dotList,
        historyList,
        changeType,
        clearPixelArt,
        undoHistory,
        importJson,
        exportJson,
        exportImage,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .pixel-art-container {
    .pixel-art {
      display: inline-flex;
      flex-wrap: wrap;
      vertical-align: top;
      position: relative;

      .hover-canvas {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 10;
      }
    }

    .form-main {
      .form-bar {
        margin-bottom: 20px;
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
