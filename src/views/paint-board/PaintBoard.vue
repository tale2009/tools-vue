<template>
    <div class="paint-board-container">
        <Page>
            <template #default>
                <div class="paint-board" :style="paintBoardStyle">
                    <canvas ref="canvas"></canvas>
                </div>
            </template>

            <template #form>
                <div class="form-title">
                    <span>画图板</span>
                </div>

                <div class="form-main">
                    <el-space class="form-bar" :size="10">
                        <el-button plain size="small" @click="restoreHistory" :disabled="!historyList.length">撤销</el-button>
                        <el-popconfirm title="是否清空画板？" @confirm="clearPaintBoard">
                            <template #reference>
                                <el-button type="danger" size="small">清空</el-button>
                            </template>
                        </el-popconfirm>
                    </el-space>

                    <el-form :model="form" label-width="auto" size="small">
                        <el-form-item label="宽度">
                            <el-input-number v-model="form.width" :min="100" :max="9999" :precision="0" @change="resetSize"></el-input-number>
                        </el-form-item>
                        <el-form-item label="高度">
                            <el-input-number v-model="form.height" :min="100" :max="9999" :precision="0" @change="resetSize"></el-input-number>
                        </el-form-item>
                        <el-form-item label="工具">
                            <el-space :size="10" wrap>
                                <el-check-tag :checked="form.type === 'pencil'" @change="changeType('pencil')">铅笔</el-check-tag>
                                <el-check-tag :checked="form.type === 'text'" @change="changeType('text')" v-if="false">文本</el-check-tag>
                                <el-check-tag :checked="form.type === 'eraser'" @change="changeType('eraser')">橡皮擦</el-check-tag>
                            </el-space>
                        </el-form-item>
                        <el-form-item label="形状">
                            <el-space :size="10" wrap>
                                <el-check-tag :checked="form.type === 'straight'" @change="changeType('straight')">直线</el-check-tag>
                                <el-check-tag :checked="form.type === 'rectangle'" @change="changeType('rectangle')">矩形</el-check-tag>
                                <el-check-tag :checked="form.type === 'ellipse'" @change="changeType('ellipse')">圆形</el-check-tag>
                            </el-space>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-color-picker v-model="form.color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="线宽">
                            <el-slider v-model="form.lineWidth" :min="1" :max="30"></el-slider>
                        </el-form-item>
                    </el-form>

                    <el-button style="width: 100%" type="primary" size="medium" @click="exportImage">导出图片</el-button>
                </div>
            </template>
        </Page>
    </div>
</template>

<script>
    import Page from '@/components/page/Page';
    import {computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref} from 'vue';
    import html2canvas from '@/assets/js/html2canvas';
    import usePaint from '@/views/paint-board/use-paint';

    export default {
        name: 'PaintBoard',
        components: {
            Page
        },
        setup() {
            const {ctx} = getCurrentInstance();
            const canvas = ref(null);
            const context = ref(null);
            const form = reactive({
                width: 1920,
                height: 1080,
                type: 'pencil',
                color: '#000',
                lineWidth: 3
            });
            const downPoint = ref({}); // 鼠标按钮坐标
            const lastPoint = ref({});  // 上一次的坐标
            const historyList = ref([]); // 保存历史图像

            const usePaintKey = {
                context,
                form,
                downPoint,
                lastPoint,
                historyList
            };

            onMounted(() => {
                createPaintBoard();
            });

            onBeforeUnmount(() => {
                canvas.value.removeEventListener('mousedown', onMousedown);
            });

            const createPaintBoard = () => {
                context.value = canvas.value.getContext('2d');

                canvas.value.width = form.width;
                canvas.value.height = form.height;

                canvas.value.addEventListener('mousedown', onMousedown);
            };

            const paintBoardStyle = computed(() => {
                return {
                    width: `${form.width}px`,
                    height: `${form.height}px`
                };
            });

            const resetSize = () => {
                const history = context.value.getImageData(0, 0, canvas.value.width, canvas.value.height);

                canvas.value.width = form.width;
                canvas.value.height = form.height;

                context.value.putImageData(history, 0, 0);
            };

            const changeType = type => {
                form.type = type;
            };

            const saveHistory = () => {
                const history = context.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
                historyList.value.push(history);
            };

            const restoreHistory = () => {
                const history = historyList.value.pop();
                context.value.putImageData(history, 0, 0);
            };

            const clearPaintBoard = () => {
                context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
                historyList.value = [];
            };

            const onMousedown = e => {
                const x = e.offsetX;
                const y = e.offsetY;
                addEventListener('mousemove', onMousemove);
                addEventListener('mouseup', onMouseup);
                saveHistory();
                downPoint.value = {x, y};
                lastPoint.value = {x, y};
                usePaint(usePaintKey, form.type, e);

                document.onselectstart = () => false;
                document.ondragstart = () => false;
            };

            const onMousemove = e => {
                const x = e.offsetX;
                const y = e.offsetY;
                if (e.target === canvas.value) {
                    usePaint(usePaintKey, form.type, e);
                    lastPoint.value = {x, y};
                } else {
                    lastPoint.value = {};
                }
            };

            const onMouseup = () => {
                downPoint.value = {};
                lastPoint.value = {};

                removeEventListener('mousemove', onMousemove);
                removeEventListener('mouseup', onMouseup);

                document.onselectstart = null;
                document.ondragstart = null;
            };

            const exportImage = () => {
                let element = document.querySelector('.paint-board');
                html2canvas(element, {
                    backgroundColor: 'transparent',
                    onclone: doc => {
                        let paintBoard = doc.querySelector('.paint-board');
                        paintBoard.style.boxShadow = 'none';
                    }
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = ctx.dataURLtoBlob(dataURL);
                    ctx.downloadBlob(blob, '画图板');
                });
            };

            return {
                canvas,
                context,
                form,
                historyList,
                paintBoardStyle,
                restoreHistory,
                clearPaintBoard,
                resetSize,
                changeType,
                exportImage
            };
        }
    };
</script>

<style lang="scss" scoped>
    .paint-board-container {
        .paint-board {
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        }

        .form-main {
            .form-bar {
                margin-bottom: 20px;
            }
        }
    }
</style>
