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
                        <el-button type="danger" size="small" @click="clearPaintBoard">清空</el-button>
                    </el-space>

                    <el-form :model="form" label-width="auto" size="small">
                        <el-form-item label="宽度">
                            <el-input-number v-model="form.width" :min="100" :max="9999" :precision="0" @change="resetSize"></el-input-number>
                        </el-form-item>
                        <el-form-item label="高度">
                            <el-input-number v-model="form.height" :min="100" :max="9999" :precision="0" @change="resetSize"></el-input-number>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-color-picker v-model="form.color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="线宽">
                            <el-slider v-model="form.lineWidth" :min="1" :max="10"></el-slider>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
        </Page>
    </div>
</template>

<script>
    import Page from '@/components/page/Page';
    import {computed, onBeforeUnmount, onMounted, reactive, ref} from 'vue';

    export default {
        name: 'PaintBoard',
        components: {
            Page
        },
        setup() {
            let canvas = ref(null);
            let context;
            let form = reactive({
                width: 1920,
                height: 1080,
                color: '#000',
                lineWidth: 3
            });
            let lastPoint = ref({});
            let historyList = ref([]); // 保存历史图像

            onMounted(() => {
                context = canvas.value.getContext('2d');

                canvas.value.width = form.width;
                canvas.value.height = form.height;

                context.lineCap = 'round';
                context.lineJoin = 'round';

                canvas.value.addEventListener('mousedown', onMousedown);
            });

            onBeforeUnmount(() => {
                canvas.value.removeEventListener('mousedown', onMousedown);
            });

            const paintBoardStyle = computed(() => {
                return {
                    width: `${form.width}px`,
                    height: `${form.height}px`
                };
            });

            const resetSize = () => {
                let history = context.getImageData(0, 0, canvas.value.width, canvas.value.height);

                canvas.value.width = form.width;
                canvas.value.height = form.height;

                context.putImageData(history, 0, 0);
            };

            const drawLine = (x, y) => {
                context.beginPath();
                context.moveTo(lastPoint.value.x, lastPoint.value.y);
                context.lineTo(x, y);
                lastPoint.value = {x: x, y: y};
                context.lineWidth = form.lineWidth;
                context.strokeStyle = form.color;
                context.stroke();
            };

            const saveHistory = () => {
                let history = context.getImageData(0, 0, canvas.value.width, canvas.value.height);
                historyList.value.push(history);
            };

            const restoreHistory = () => {
                let history = historyList.value.pop();
                context.putImageData(history, 0, 0);
            };

            const clearPaintBoard = () => {
                context.clearRect(0, 0, canvas.value.width, canvas.value.height);
                historyList.value = [];
            };

            const onMousedown = e => {
                canvas.value.addEventListener('mousemove', onMousemove);
                addEventListener('mouseup', onMouseup);
                saveHistory();
                lastPoint.value = {x: e.offsetX, y: e.offsetY};
                drawLine(e.offsetX, e.offsetY);

                document.onselectstart = () => false;
                document.ondragstart = () => false;
            };

            const onMousemove = e => {
                drawLine(e.offsetX, e.offsetY);
            };

            const onMouseup = () => {
                canvas.value.removeEventListener('mousemove', onMousemove);
                removeEventListener('mouseup', onMouseup);

                document.onselectstart = null;
                document.ondragstart = null;
            };

            return {
                canvas,
                form,
                lastPoint,
                historyList,
                paintBoardStyle,
                restoreHistory,
                clearPaintBoard,
                resetSize
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
