<template>
    <div class="dot-word-container">
        <Page>
            <template>
                <div class="word-list">
                    <div class="word" v-for="word in wordList" :style="wordStyle">
                        <div class="row" v-for="row in word">
                            <div class="dot" v-for="dot in row" :style="dotStyle(dot)"></div>
                        </div>
                    </div>
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
                        <el-form-item label="形状">
                            <el-radio-group v-model="form.shape">
                                <el-radio-button label="square">方形</el-radio-button>
                                <el-radio-button label="round">圆形</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="颜色" style="margin-bottom: 8px">
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
    import Page from '@/components/page/Page';
    import html2canvas from 'html2canvas';

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
                    shape: 'square',
                    color: '#000000',
                    grayscale: false,
                    grid: false,
                    threshold: 64,
                    size: 10
                },
                fontList: ['宋体', '黑体', '楷体', '仿宋', '微软雅黑'],
                wordList: []
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
            },
            dotStyle(dot) {
                let background;
                if (this.form.grayscale) {
                    if (this.form.color) {
                        let r = parseInt(this.form.color.substring(1, 3), 16);
                        let g = parseInt(this.form.color.substring(3, 5), 16);
                        let b = parseInt(this.form.color.substring(5, 7), 16);
                        let a = dot / 255;
                        background = `rgba(${r}, ${g}, ${b}, ${a})`;
                    }
                } else {
                    background = dot >= this.form.threshold ? this.form.color : 'transparent';
                }

                return {
                    width: `${this.form.size}px`,
                    height: `${this.form.size}px`,
                    background: background,
                    border: this.form.grid ? '1px solid #dcdfe6' : '',
                    borderRadius: this.form.shape === 'round' ? '100%' : ''
                };
            },
            // 是否为半角
            isHalfWidth(item) {
                let halfWidthReg = /[\x00-\xff]/g;
                return halfWidthReg.test(item);
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
        computed: {
            wordStyle() {
                return {
                    border: this.form.grid ? '1px solid #dcdfe6' : '',
                    margin: `${this.form.size / 2}px`
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dot-word-container {
        .word-list {
            display: inline-block;

            .word {
                display: inline-block;

                .row {
                    display: flex;
                    flex-wrap: nowrap;
                }
            }
        }
    }
</style>