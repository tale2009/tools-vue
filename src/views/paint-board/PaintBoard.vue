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

                    <el-form ref="form" :model="form" label-width="auto" size="small">
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

    export default {
        name: 'PaintBoard',
        components: {
            Page
        },
        data() {
            return {
                form: {
                    width: 1920,
                    height: 1080,
                    color: '#000',
                    lineWidth: 3
                },
                lastPoint: {},
                historyList: [] // 保存历史图像
            };
        },
        mounted() {
            this.createPaintBoard();
        },
        beforeUnmount() {
            let canvas = this.$refs.canvas;
            canvas.removeEventListener('mousedown', this.onMousedown);
        },
        methods: {
            createPaintBoard() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');

                canvas.width = this.form.width;
                canvas.height = this.form.height;

                context.lineCap = 'round';
                context.lineJoin = 'round';

                canvas.addEventListener('mousedown', this.onMousedown);
            },
            resetSize() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');

                let history = context.getImageData(0, 0, canvas.width, canvas.height);

                canvas.width = this.form.width;
                canvas.height = this.form.height;

                context.putImageData(history, 0, 0);
            },
            drawLine(x, y) {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');
                context.beginPath();
                context.moveTo(this.lastPoint.x, this.lastPoint.y);
                context.lineTo(x, y);
                this.lastPoint = {x: x, y: y};
                context.lineWidth = this.form.lineWidth;
                context.strokeStyle = this.form.color;
                context.stroke();
            },
            saveHistory() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');
                let history = context.getImageData(0, 0, canvas.width, canvas.height);
                this.historyList.push(history);
            },
            restoreHistory() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');
                let history = this.historyList.pop();
                context.putImageData(history, 0, 0);
            },
            clearPaintBoard() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.historyList = [];
            },
            onMousedown(e) {
                let canvas = this.$refs.canvas;
                canvas.addEventListener('mousemove', this.onMousemove);
                addEventListener('mouseup', this.onMouseup);
                this.saveHistory();
                this.lastPoint = {x: e.offsetX, y: e.offsetY};
                this.drawLine(e.offsetX, e.offsetY);

                document.onselectstart = () => false;
                document.ondragstart = () => false;
            },
            onMousemove(e) {
                this.drawLine(e.offsetX, e.offsetY);
            },
            onMouseup() {
                let canvas = this.$refs.canvas;
                canvas.removeEventListener('mousemove', this.onMousemove);
                removeEventListener('mouseup', this.onMouseup);

                document.onselectstart = null;
                document.ondragstart = null;
            }
        },
        computed: {
            paintBoardStyle() {
                return {
                    width: `${this.form.width}px`,
                    height: `${this.form.height}px`
                };
            }
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
