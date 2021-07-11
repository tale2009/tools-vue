<template>
    <div class="pixel-art-container">
        <Page>
            <template #default>
                <div class="pixel-art">
                    <canvas ref="canvas"></canvas>
                </div>
            </template>

            <template #form>
                <PageForm title="像素画">
                    <el-button-group class="form-bar">
                        <el-button plain icon="fas fa-undo" size="small" @click="undoHistory" :disabled="!historyList.length"></el-button>
                        <el-popconfirm title="是否清空画板？" @confirm="clearPixelArt">
                            <template #reference>
                                <el-button type="danger" icon="fas fa-trash" size="small"></el-button>
                            </template>
                        </el-popconfirm>
                    </el-button-group>

                    <el-form :model="form" label-width="auto" size="small">
                        <el-form-item label="宽度">
                            <el-input-number v-model="form.widthPixel" :min="1" :max="64" :precision="0"></el-input-number>
                            <span class="tip">（像素）</span>
                        </el-form-item>
                        <el-form-item label="高度">
                            <el-input-number v-model="form.heightPixel" :min="1" :max="64" :precision="0"></el-input-number>
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
                            <el-color-picker v-model="form.color" show-alpha></el-color-picker>
                        </el-form-item>
                        <el-form-item label="黑白">
                            <el-switch v-model="form.monochrome"></el-switch>
                        </el-form-item>
                        <el-form-item label="网格">
                            <el-switch v-model="form.grid"></el-switch>
                        </el-form-item>
                        <el-form-item label="缩放">
                            <el-slider v-model="form.size" :min="1" :max="100"></el-slider>
                        </el-form-item>
                    </el-form>

                    <div class="button-group">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-upload action="/" :show-file-list="false" accept="application/json" :before-upload="importJson">
                                    <el-button plain size="medium">导入数据</el-button>
                                </el-upload>
                            </el-col>
                            <el-col :span="12">
                                <el-button plain size="medium" @click="exportJson">导出数据</el-button>
                            </el-col>
                            <el-col :span="24">
                                <el-button type="primary" size="medium" @click="exportImage">导出图片</el-button>
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
    import {computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
    import html2canvas from '@/assets/js/html2canvas';
    import _ from 'lodash';
    import usePixel from './use-pixel';

    export default {
        name: 'PixelArt',
        components: {
            Page,
            PageForm
        },
        setup() {
            const {proxy} = getCurrentInstance();
            const canvas = ref(null);
            const context = ref(null);
            let form = reactive({
                heightPixel: 16,
                widthPixel: 16,
                type: 'pencil',
                shape: 'square',
                color: 'rgba(0, 0, 0, 1)',
                monochrome: false,
                grid: true,
                size: 30
            });
            const dotList = ref([]);
            const historyList = ref([]);
            const currentDot = ref(null);   // 鼠标当前所在点
            const lineWidth = computed(() => form.grid ? 1 : 0);
            const pixel = computed(() => form.size);
            const isMousedown = ref(false);

            const usePixelKey = {
                form,
                dotList,
                currentDot,
                isMousedown
            };

            onMounted(() => {
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
                context.value = canvas.value.getContext('2d');
                canvas.value.width = form.widthPixel * pixel.value + lineWidth.value;
                canvas.value.height = form.heightPixel * pixel.value + lineWidth.value;

                dotList.value.forEach((row, rowIndex) => {
                    row.forEach((col, colIndex) => {
                        addDot({
                            rowIndex,
                            colIndex,
                            color: col
                        });
                    });
                });

                if (currentDot.value) {
                    addDot({
                        rowIndex: currentDot.value.rowIndex,
                        colIndex: currentDot.value.colIndex,
                        color: [255, 255, 255, 0]
                    });
                }
            };

            const addDot = ({rowIndex, colIndex, color}) => {
                context.value.strokeStyle = isCurrentDot(rowIndex, colIndex) ? '#409eff' : '#dcdfe6';
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
                    if (form.grid || isCurrentDot(rowIndex, colIndex)) {
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
                    if (form.grid || isCurrentDot(rowIndex, colIndex)) {
                        context.value.stroke();
                    }
                }
            };

            const isCurrentDot = (rowIndex, colIndex) => {
                if (!currentDot.value) return false;
                return currentDot.value.rowIndex === rowIndex && currentDot.value.colIndex === colIndex;
            };

            const changeType = type => {
                form.type = type;
            };

            const clearPixelArt = () => {
                dotList.value = [];
                createDotList();
            };

            const onMousemove = e => {
                // 算式：const x = colIndex * pixel.value + lineWidth.value / 2;
                //       const y = rowIndex * pixel.value + lineWidth.value / 2;
                const x = e.offsetX;
                const y = e.offsetY;
                const colIndex = Math.floor((x - lineWidth.value / 2) / pixel.value);
                const rowIndex = Math.floor((y - lineWidth.value / 2) / pixel.value);
                if (colIndex < 0 || rowIndex < 0) {
                    return;
                }
                currentDot.value = {rowIndex, colIndex};
            };

            const onMouseleave = () => {
                currentDot.value = null;
            };

            const onMousedown = () => {
                isMousedown.value = true;
                saveHistory();
                usePixel(usePixelKey, form.type);
                createDotList();

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
                const {ctrlKey, key} = e;
                if (ctrlKey && key === 'z') {
                    undoHistory();
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
                    dotList: dotList.value
                });
                let blob = new Blob([data], {type: 'application/json'});
                proxy.downloadBlob(blob, '像素画');
            };

            const exportImage = () => {
                let element = document.querySelector('.pixel-art');
                html2canvas(element, {
                    backgroundColor: 'transparent'
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = proxy.dataURLtoBlob(dataURL);
                    proxy.downloadBlob(blob, '像素画');
                });
            };

            watch(form, () => {
                createDotList();
            }, {
                deep: true
            });

            watch(currentDot, (newVal, oldVal) => {
                if (!_.isEqual(newVal, oldVal)) {
                    usePixel(usePixelKey, form.type);
                    createDotList();
                }
            });

            return {
                canvas,
                context,
                form,
                dotList,
                historyList,
                changeType,
                clearPixelArt,
                undoHistory,
                importJson,
                exportJson,
                exportImage
            };
        }
    };
</script>

<style lang="scss" scoped>
    .pixel-art-container {
        .pixel-art {
            display: inline-flex;
            flex-wrap: wrap;
            vertical-align: top;
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
