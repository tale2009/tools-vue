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
                    <el-form :model="form" label-width="auto" size="small">
                        <el-form-item label="宽度">
                            <el-input-number v-model="form.widthPixel" :min="1" :max="128" :precision="0"></el-input-number>
                            <span class="tip">（像素）</span>
                        </el-form-item>
                        <el-form-item label="高度">
                            <el-input-number v-model="form.heightPixel" :min="1" :max="128" :precision="0"></el-input-number>
                            <span class="tip">（像素）</span>
                        </el-form-item>
                        <el-form-item label="形状">
                            <el-radio-group v-model="form.shape">
                                <el-radio-button label="square">方形</el-radio-button>
                                <el-radio-button label="round">圆形</el-radio-button>
                            </el-radio-group>
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
                </PageForm>
            </template>
        </Page>
    </div>
</template>

<script>
    import Page from '@/components/page/Page';
    import PageForm from '@/components/page/PageForm';

    export default {
        name: "PixelArt",
        components: {
            Page,
            PageForm
        },
        data() {
            return {
                form: {
                    heightPixel: 16,
                    widthPixel: 16,
                    shape: 'square',
                    monochrome: false,
                    grid: true,
                    size: 30
                },
                dotList: []
            }
        },
        mounted() {
            this.createDotList();
        },
        methods: {
            createDotList() {
                let pixelX = this.form.widthPixel;
                let pixelY = this.form.heightPixel;
                let defaultColor = [255, 255, 255, 0];
                let dotList = [];
                let rowList = [];
                rowList.length = pixelX;
                rowList.fill(defaultColor)
                dotList.length = pixelY;
                dotList.fill(rowList);

                this.dotList = dotList;
                this.renderCanvas();
            },
            renderCanvas() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext('2d');
                const lineWidth = this.form.grid ? 1 : 0;
                const pixel = this.form.size;
                canvas.width = this.form.widthPixel * pixel + lineWidth;
                canvas.height = this.form.heightPixel * pixel + lineWidth;
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
            }
        },
        watch: {
            form: {
                handler() {
                    this.createDotList();
                },
                deep: true
            }
        }
    };
</script>

<style lang="scss" scoped>
    .pixel-art-container {

    }
</style>
