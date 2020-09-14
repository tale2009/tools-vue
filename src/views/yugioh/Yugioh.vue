<template>
    <div class="yugioh-container">
        <Page>
            <template>
                <div class="yugioh-card" :style="cardStyle" ondragstart="return false">
                    <div class="card-name" :style="nameStyle">
                        <span v-compressText="{width:1030,height:150}">{{form.name}}</span>
                    </div>

                    <div class="card-attribute">
                        <el-image :src="attributeSrc"></el-image>
                    </div>

                    <div class="card-level" v-if="form.type==='monster'&&['normal','effect','ritual','fusion','synchro','token'].includes(form.cardType)">
                        <el-image v-for="item in form.level" :src="baseImage + '/level.png'"></el-image>
                    </div>

                    <div class="card-rank" v-if="form.type==='monster'&&form.cardType==='xyz'">
                        <el-image v-for="item in form.rank" :src="baseImage + '/rank.png'"></el-image>
                    </div>

                    <div class="spell-trap" v-if="['spell','trap'].includes(form.type)">
                        <span v-if="form.type==='spell'">【魔法卡</span>
                        <span v-if="form.type==='trap'">【陷阱卡</span>
                        <el-image v-if="form.icon" :src="`${baseImage}/icon-${form.icon}.png`"></el-image>
                        <span>】</span>
                    </div>

                    <div class="card-image" v-if="form.image" :style="cardImageStyle">
                        <!--html2canvas不支持object-fit，只能用background-->
                    </div>

                    <div class="card-mask">
                        <el-image :src="baseImage + '/card-mask.png'" fit="cover"></el-image>
                    </div>

                    <div class="card-package" :style="packageStyle">
                        <span>{{form.package}}</span>
                    </div>

                    <div class="link-arrow" v-if="form.type==='monster'&&form.cardType==='link'">
                        <el-image :src="baseImage + '/arrow-base.png'" style="top: 293px;left: 87px"></el-image>
                        <el-image :src="baseImage + '/arrow-up.png'" style="top: 301px;left: 577px" v-if="form.arrowList.includes(1)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-up.png'" style="top: 322px;left: 1149px" v-if="form.arrowList.includes(2)"></el-image>
                        <el-image :src="baseImage + '/arrow-right.png'" style="top: 782px;left: 1223px" v-if="form.arrowList.includes(3)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-down.png'" style="top: 1355px;left: 1149px" v-if="form.arrowList.includes(4)"></el-image>
                        <el-image :src="baseImage + '/arrow-down.png'" style="top: 1430px;left: 577px" v-if="form.arrowList.includes(5)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-down.png'" style="top: 1355px;left: 118px" v-if="form.arrowList.includes(6)"></el-image>
                        <el-image :src="baseImage + '/arrow-left.png'" style="top: 779px;left: 95px" v-if="form.arrowList.includes(7)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-up.png'" style="top: 322px;left: 118px" v-if="form.arrowList.includes(8)"></el-image>
                    </div>

                    <div class="card-description">
                        <span v-if="form.type==='monster'" class="card-effect">【{{form.monsterType}}】</span>
                        <span v-compressText="{width:1170,height:descriptionHeight}">{{form.description}}</span>
                    </div>

                    <div class="atk-def-link">
                        <el-image :src="baseImage + '/atk-def.png'" v-if="form.type==='monster'&&form.cardType!=='link'"></el-image>
                        <el-image :src="baseImage + '/atk-link.png'" v-if="form.type==='monster'&&form.cardType==='link'"></el-image>
                    </div>

                    <div class="card-atk" v-if="form.type==='monster'">
                        <span>{{form.atk}}</span>
                    </div>

                    <div class="card-def" v-if="form.type==='monster'&&form.cardType!=='link'">
                        <span>{{form.def}}</span>
                    </div>

                    <div class="card-link" v-if="form.type==='monster'&&form.cardType==='link'">
                        <span>{{form.arrowList.length}}</span>
                    </div>

                    <div class="card-password" :style="passwordStyle">
                        <span>{{form.password}}</span>
                    </div>

                    <div class="card-laser" v-if="form.laser">
                        <el-image :src="baseImage + '/laser.png'"></el-image>
                    </div>
                </div>
            </template>

            <template #form>
                <div class="form-title">
                    <span>游戏王卡片生成器</span>
                    <span class="form-remarks">最大尺寸 1393 px * 2031 px，超高清素材 by 怀特索尔</span>
                </div>

                <div class="form-main">
                    <div class="font-loading" v-if="fontLoading">
                        <i class="el-icon-loading"></i>
                        <span>字体加载中...</span>
                    </div>

                    <el-form ref="form" :model="form" label-width="auto" size="small">
                        <el-form-item label="卡名">
                            <el-input v-model="form.name" placeholder="请输入卡名"></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-radio-group v-model="form.type">
                                <el-radio-button label="monster">怪兽</el-radio-button>
                                <el-radio-button label="spell">魔法</el-radio-button>
                                <el-radio-button label="trap">陷阱</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="属性" v-if="form.type==='monster'">
                            <el-radio-group v-model="form.attribute">
                                <el-radio-button label="dark">暗</el-radio-button>
                                <el-radio-button label="light">光</el-radio-button>
                                <el-radio-button label="earth">地</el-radio-button>
                                <el-radio-button label="water">水</el-radio-button>
                                <el-radio-button label="fire">炎</el-radio-button>
                                <el-radio-button label="wind">风</el-radio-button>
                                <el-radio-button label="divine">神</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="图标" v-if="['spell','trap'].includes(form.type)">
                            <el-select v-model="form.icon" placeholder="请选择卡类">
                                <el-option label="通常" value=""></el-option>
                                <el-option label="装备" value="equip"></el-option>
                                <el-option label="场地" value="filed"></el-option>
                                <el-option label="速攻" value="quick-play"></el-option>
                                <el-option label="仪式" value="ritual"></el-option>
                                <el-option label="永续" value="continuous"></el-option>
                                <el-option label="反击" value="counter"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="图片">
                            <el-upload action="/" :show-file-list="false" accept="image/*" :before-upload="beforeUpload">
                                <el-button type="primary">选择图片</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="卡类" v-if="form.type==='monster'">
                            <el-select v-model="form.cardType" placeholder="请选择卡类">
                                <el-option label="通常" value="normal"></el-option>
                                <el-option label="效果" value="effect"></el-option>
                                <el-option label="仪式" value="ritual"></el-option>
                                <el-option label="融合" value="fusion"></el-option>
                                <el-option label="同调" value="synchro"></el-option>
                                <el-option label="超量" value="xyz"></el-option>
                                <el-option label="连接" value="link"></el-option>
                                <el-option label="衍生物" value="token"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="星级" v-if="form.type==='monster'&&['normal','effect','ritual','fusion','synchro','token'].includes(form.cardType)">
                            <el-input-number v-model="form.level" :min="1" :max="12" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="阶级" v-if="form.type==='monster'&&form.cardType==='xyz'">
                            <el-input-number v-model="form.rank" :min="1" :max="12" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="种族" v-if="form.type==='monster'">
                            <el-input v-model="form.monsterType" placeholder="请输入种族"></el-input>
                        </el-form-item>
                        <el-form-item label="ATK" v-if="form.type==='monster'">
                            <el-input-number v-model="form.atk" :min="0" :max="9999" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="DEF" v-if="form.type==='monster'&&form.cardType!=='link'">
                            <el-input-number v-model="form.def" :min="0" :max="9999" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="箭头" v-if="form.type==='monster'&&form.cardType==='link'">
                            <div class="arrow-form">
                                <div class="arrow-item" v-for="item in [8,1,2,7,9,3,6,5,4]" @click="toggleArrow(item)" :style="arrowItemStyle(item)">
                                    <i class="fas fa-arrow-alt-up" v-if="item===1"></i>
                                    <i class="fas fa-arrow-alt-up" style="transform: rotate(45deg)" v-if="item===2"></i>
                                    <i class="fas fa-arrow-alt-right" v-if="item===3"></i>
                                    <i class="fas fa-arrow-alt-right" style="transform: rotate(45deg)" v-if="item===4"></i>
                                    <i class="fas fa-arrow-alt-down" v-if="item===5"></i>
                                    <i class="fas fa-arrow-alt-down" style="transform: rotate(45deg)" v-if="item===6"></i>
                                    <i class="fas fa-arrow-alt-left" v-if="item===7"></i>
                                    <i class="fas fa-arrow-alt-left" style="transform: rotate(45deg)" v-if="item===8"></i>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="效果">
                            <el-input type="textarea" :autosize="{minRows: 3}" v-model="form.description" placeholder="请输入效果"></el-input>
                        </el-form-item>
                        <el-form-item label="卡包">
                            <el-input v-model="form.package" placeholder="请输入卡包"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="角标">
                            <el-switch v-model="form.laser"></el-switch>
                        </el-form-item>
                        <el-form-item label="缩放">
                            <el-slider v-model="form.scale" :min="0.1" :max="1" :step="0.1"></el-slider>
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
        name: 'Yugioh',
        components: {
            Page
        },
        mounted() {
            document.fonts.ready.then(() => {
                this.fontLoading = false;
            });
        },
        data() {
            return {
                baseImage: 'http://static.kooriookami.top/yugioh/image',
                fontLoading: true,
                form: {
                    name: '青眼白龙',
                    type: 'monster',
                    attribute: 'light',
                    icon: '',
                    image: require('@/assets/image/blue-eyes.jpg'),
                    cardType: 'normal',
                    level: 8,
                    rank: 1,
                    monsterType: '龙族/通常',
                    atk: 3000,
                    def: 2500,
                    arrowList: [],
                    description: '以高攻击力著称的传说之龙。任何对手都能粉碎，其破坏力不可估量。',
                    package: 'SD25-SC001',
                    password: '89631139',
                    scale: 0.5,
                    laser: false
                }
            };
        },
        methods: {
            beforeUpload(file) {
                let flag = file.type.includes('image');
                if (flag) {
                    this.fileToDataURL(file).then(res => {
                        this.form.image = res.target.result;
                    });
                } else {
                    this.$message.warning('请选择正确图片格式');
                }
                return flag;
            },
            toggleArrow(item) {
                if (this.form.arrowList.includes(item)) {
                    this.form.arrowList = this.form.arrowList.filter(value => value !== item);
                } else {
                    this.form.arrowList.push(item);
                }
            },
            arrowItemStyle(item) {
                let border = '';
                let color = '';
                if (this.form.arrowList.includes(item)) {
                    border = '1px solid darkorange';
                    color = 'darkorange';
                }
                return {
                    border: border,
                    color: color,
                    visibility: item === 9 ? 'hidden' : ''
                };
            },
            exportImage() {
                let element = document.querySelector('.yugioh-card');
                html2canvas(element, {
                    useCORS: true,
                    width: this.form.scale * 1393,
                    height: this.form.scale * 2031,
                    onclone: (doc) => {
                        // 微调字体位置
                        let cardAtk = doc.querySelector('.card-atk');
                        if (cardAtk) {
                            cardAtk.style.top = '1837px';
                        }
                        let cardDef = doc.querySelector('.card-def');
                        if (cardDef) {
                            cardDef.style.top = '1837px';
                        }
                        let cardLink = doc.querySelector('.card-link');
                        if (cardLink) {
                            cardLink.style.top = '1848px';
                        }
                    }
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = this.dataURLtoBlob(dataURL);
                    let a = document.createElement('a');
                    a.download = this.form.name;
                    a.href = URL.createObjectURL(blob);
                    a.click();
                });
            }
        },
        computed: {
            cardStyle() {
                let background;
                if (this.form.type === 'monster') {
                    background = `url(${this.baseImage}/card-${this.form.cardType}.png) no-repeat center/cover`;
                } else {
                    background = `url(${this.baseImage}/card-${this.form.type}.png) no-repeat center/cover`;
                }
                return {
                    transform: `scale(${this.form.scale})`,
                    background: background,
                    marginRight: `${(this.form.scale - 1) * 1393}px`,
                    marginBottom: `${(this.form.scale - 1) * 2031}px`
                };
            },
            nameStyle() {
                let color;
                if (this.form.type === 'monster') {
                    if (['xyz', 'link'].includes(this.form.cardType)) {
                        color = 'white';
                    } else {
                        color = 'black';
                    }
                } else {
                    color = 'white';
                }

                return {
                    color: color
                };
            },
            attributeSrc() {
                if (this.form.type === 'monster') {
                    return `${this.baseImage}/attribute-${this.form.attribute}.png`;
                } else {
                    return `${this.baseImage}/attribute-${this.form.type}.png`;
                }
            },
            cardImageStyle() {
                return {
                    background: `url(${this.form.image}) no-repeat center/cover`
                };
            },
            packageStyle() {
                return {
                    color: this.form.cardType === 'xyz' ? 'white' : 'black',
                    right: this.form.cardType === 'link' ? '252px' : '148px'
                };
            },
            descriptionHeight() {
                let height;
                if (this.form.type === 'monster') {
                    height = 260;
                } else {
                    height = 370;
                }
                return height;
            },
            passwordStyle() {
                return {
                    color: this.form.cardType === 'xyz' ? 'white' : 'black'
                };
            }
        },
        directives: {
            // 文本压缩变形
            compressText: (el, binding) => {
                setTimeout(() => {
                    let scale = 1;
                    el.style.display = 'inline-block';
                    el.style.wordBreak = 'break-all';
                    el.style.width = `${binding.value.width}px`;
                    el.style.transform = 'none';
                    el.style.transformOrigin = '0 0';

                    while (el.clientHeight > binding.value.height && scale > 0) {
                        scale -= 0.01;
                        el.style.width = `${binding.value.width / scale}px`;
                        el.style.transform = `scaleX(${scale})`;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .yugioh-container {
        .yugioh-card {
            width: 1393px;
            height: 2031px;
            font-family: 'ygo-sc', '楷体', serif;
            position: relative;
            user-select: none;
            color: black;
            transform-origin: 0 0;

            .card-name {
                position: absolute;
                font-size: 108px;
                left: 116px;
                top: 100px;
                width: 1030px;
                max-height: 150px;
                overflow: hidden;
            }

            .card-attribute {
                position: absolute;
                left: 1161px;
                top: 98px;
            }

            .card-level {
                position: absolute;
                right: 146px;
                top: 250px;

                .el-image {
                    margin-left: 3px;
                }
            }

            .card-rank {
                position: absolute;
                left: 147px;
                top: 250px;

                .el-image {
                    margin-right: 3px;
                }
            }

            .spell-trap {
                position: absolute;
                right: 94px;
                top: 256px;
                font-size: 76px;
                letter-spacing: 2px;
                display: flex;
                align-items: center;

                .el-image {
                    display: flex;
                    min-width: 72px;
                }
            }

            .card-image {
                position: absolute;
                left: 171px;
                top: 374px;
                width: 1051px;
                height: 1054px;
            }

            .card-mask {
                position: absolute;
                z-index: 10;
                left: 168px;
                top: 371px;
            }

            .card-package {
                position: absolute;
                top: 1456px;
                font-family: ygo-password, serif;
                font-size: 40px;
            }

            .link-arrow {
                .el-image {
                    position: absolute;
                    z-index: 20;
                }
            }

            .card-description {
                position: absolute;
                top: 1528px;
                left: 109px;
                width: 1170px;
                font-size: 36px;
                letter-spacing: 2px;
                text-align: justify;
                overflow: hidden;

                span {
                    display: block;
                }

                .card-effect {
                    text-indent: -0.5em;
                    font-size: 44px;
                }
            }

            .atk-def-link {
                position: absolute;
                left: 109px;
                top: 1844px;
            }

            .card-atk {
                position: absolute;
                right: 401px;
                top: 1847px;
                font-family: ygo-atk-def, serif;
                font-size: 58px;
                letter-spacing: 2px;
            }

            .card-def {
                position: absolute;
                right: 130px;
                top: 1847px;
                font-family: ygo-atk-def, serif;
                font-size: 58px;
                letter-spacing: 2px;
            }

            .card-link {
                position: absolute;
                right: 116px;
                top: 1846px;
                font-family: ygo-link, serif;
                font-size: 54px;
                letter-spacing: 2px;
            }

            .card-password {
                position: absolute;
                left: 66px;
                top: 1933px;
                font-family: ygo-password, serif;
                font-size: 39px;
            }

            .card-laser {
                position: absolute;
                left: 1276px;
                top: 1913px;
            }
        }

        .form-main {
            .font-loading {
                display: flex;
                align-items: center;
                color: $primary-color;
                margin-bottom: 20px;

                i {
                    margin-right: 10px;
                    font-size: 18px;
                }
            }

            .arrow-form {
                width: 130px;
                display: flex;
                flex-wrap: wrap;
                margin-right: -10px;
                margin-bottom: -10px;

                .arrow-item {
                    width: 32px;
                    height: 32px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    border: 1px solid $border-color;
                    border-radius: 4px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    color: $placeholder-color;
                    font-size: 18px;
                }
            }
        }
    }
</style>
