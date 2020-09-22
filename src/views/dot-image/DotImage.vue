<template>
    <div class="dot-image-container">
        <Page>
            <template>
                <div class="dot-list" :style="listStyle">
                    <div class="row" v-for="row in dotList">
                        <div class="dot" v-for="dot in row" :style="dotStyle(dot)"></div>
                    </div>
                </div>
            </template>

            <template #form>
                <div class="form-title">
                    <span>点阵图生成器</span>
                </div>

                <div class="form-main">
                    <el-form ref="form" :model="form" label-width="auto" size="small">
                        <el-form-item label="图片">
                            <el-upload action="/" :show-file-list="false" accept="image/*" :before-upload="beforeUpload">
                                <el-button type="primary">选择图片</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="像素">
                            <el-input-number v-model="form.pixel" :min="1" :max="128" @change="createDotList"></el-input-number>
                            <span class="tip">（长边）</span>
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
        name: 'DotImage',
        components: {
            Page
        },
        data() {
            return {
                form: {
                    image: require('@/assets/image/my-avatar.jpg'),
                    pixel: 48,
                    shape: 'square',
                    monochrome: false,
                    grid: false,
                    size: 10
                },
                dotList: []
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
                };
            },
            beforeUpload(file) {
                let flag = file.type.includes('image');
                if (flag) {
                    this.fileToDataURL(file).then(res => {
                        this.form.image = res.target.result;
                        this.createDotList();
                    });
                } else {
                    this.$message.warning('请选择正确图片格式');
                }
                return flag;
            },
            dotStyle(dot) {
                let background;
                if (this.form.monochrome) {
                    let rgb = Math.round((dot[0] + dot[1] + dot[2]) / 3);
                    background = `rgba(${rgb},${rgb},${rgb},${dot[3]})`;
                } else {
                    background = `rgba(${dot[0]},${dot[1]},${dot[2]},${dot[3]})`;
                }

                return {
                    width: `${this.form.size}px`,
                    height: `${this.form.size}px`,
                    background: background,
                    border: this.form.grid ? '1px solid #dcdfe6' : '',
                    borderRadius: this.form.shape === 'round' ? '100%' : ''
                };
            },
            exportImage() {
                let element = document.querySelector('.dot-list');
                html2canvas(element, {
                    backgroundColor: 'transparent'
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = this.dataURLtoBlob(dataURL);
                    this.downloadBlob(blob, '点阵图');
                });
            }
        },
        computed: {
            listStyle() {
                return {
                    border: this.form.grid ? '1px solid #dcdfe6' : ''
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dot-image-container {
        .dot-list {
            display: inline-block;

            .row {
                display: flex;
                flex-wrap: nowrap;
            }
        }
    }
</style>