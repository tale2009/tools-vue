<template>
    <div class="dot-word-container">
        <Page>
            <template #default>
                <div class="word-list">
                    <canvas :ref="el => canvasRefList[index] = el" v-for="(word,index) in wordList"></canvas>
                </div>
            </template>

            <template #form>
                <div class="form-title">
                    <span>点阵字生成器</span>
                    <span class="form-remarks">16 px 宋体效果最佳</span>
                </div>

                <div class="form-main">
                    <el-form ref="form" :model="form" label-width="auto" size="small">
                        <el-form-item label="文字">
                            <el-input v-model="form.text" placeholder="请输入文字" @input="createWordList"></el-input>
                        </el-form-item>
                        <el-form-item label="像素">
                            <el-input-number v-model="form.pixel" :min="8" :max="64" @change="createWordList"></el-input-number>
                        </el-form-item>
                        <el-form-item label="字体">
                            <el-select v-model="form.font" placeholder="请选择字体" filterable allow-create @change="createWordList">
                                <el-option v-for="item in fontList" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="字距">
                            <el-slider v-model="form.wordMargin" :min="0" :max="30"></el-slider>
                        </el-form-item>
                        <el-form-item label="点距">
                            <el-slider v-model="form.dotMargin" :min="0" :max="30"></el-slider>
                        </el-form-item>
                        <el-form-item label="形状">
                            <el-radio-group v-model="form.shape">
                                <el-radio-button label="square">方形</el-radio-button>
                                <el-radio-button label="round">圆形</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-color-picker v-model="form.color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="灰阶">
                            <el-switch v-model="form.grayscale"></el-switch>
                        </el-form-item>
                        <el-form-item label="网格">
                            <el-switch v-model="form.grid"></el-switch>
                        </el-form-item>
                        <el-form-item label="阈值">
                            <el-slider v-model="form.threshold" :min="1" :max="255"></el-slider>
                        </el-form-item>
                        <el-form-item label="缩放">
                            <el-slider v-model="form.size" :min="1" :max="30"></el-slider>
                        </el-form-item>
                    </el-form>

                    <el-button style="width: 100%" type="primary" size="medium" @click="exportImage">导出图片</el-button>
                </div>
            </template>
        </Page>
    </div>
</template>

<script>
    import {nextTick} from 'vue';
    import Page from '@/components/page/Page';
    import html2canvas from '@/assets/js/html2canvas';

    export default {
        name: 'DotWord',
        components: {
            Page
        },
        data() {
            return {
                form: {
                    text: '点阵字生成器',
                    pixel: 16,
                    font: '宋体',
                    wordMargin: 5,
                    dotMargin: 0,
                    shape: 'square',
                    color: '#000000',
                    grayscale: false,
                    grid: false,
                    gridWidth: 1,
                    threshold: 64,
                    size: 10
                },
                fontList: ['宋体', '黑体', '楷体', '仿宋', '微软雅黑'],
                wordList: [],
                canvasRefList: []
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
                    context.textBaseline = this.form.font === '微软雅黑' ? 'hanging' : 'top';
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
                let element = document.querySelector('.word-list');
                html2canvas(element, {
                    backgroundColor: 'transparent'
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = this.dataURLtoBlob(dataURL);
                    this.downloadBlob(blob, this.form.text);
                });
            }
        },
        watch: {
            form: {
                handler() {
                    this.renderCanvas();
                },
                deep: true
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dot-word-container {
        .word-list {
            display: flex;
            flex-wrap: wrap;
        }
    }
</style>
