<template>
    <div class="yugioh-container">
        <Page>
            <template>
                <div class="yugioh-card" :class="cardClass" :style="cardStyle" ondragstart="return false">
                    <div class="card-name" :style="nameStyle">
                        <span v-compressText="{width:1030,height:130}" v-html="formatVHtml(form.name)"></span>
                    </div>

                    <div class="card-attribute">
                        <el-image :src="attributeSrc"></el-image>
                    </div>

                    <div class="card-level"
                         v-if="(form.type==='monster'&&['normal','effect','ritual','fusion','synchro','token'].includes(form.cardType))
                         ||(form.type==='pendulum'&&['normal-pendulum','effect-pendulum','ritual-pendulum','fusion-pendulum','synchro-pendulum'].includes(form.pendulumType))">
                        <el-image v-for="item in form.level" :src="baseImage + '/level.png'"></el-image>
                    </div>

                    <div class="card-rank" v-if="(form.type==='monster'&&form.cardType==='xyz')||(form.type==='pendulum'&&form.pendulumType==='xyz-pendulum')">
                        <el-image v-for="item in form.rank" :src="baseImage + '/rank.png'"></el-image>
                    </div>

                    <div class="spell-trap" v-if="['spell','trap'].includes(form.type)">
                        <span>【</span>
                        <span v-html="formatVHtml(spellTrapName)"></span>
                        <el-image class="spell-trap-icon" v-if="form.icon" :src="`${baseImage}/icon-${form.icon}.png`"></el-image>
                        <span>】</span>
                    </div>

                    <div class="card-image" v-if="form.image" :style="imageStyle">
                        <!--html2canvas不支持object-fit，只能用background-->
                    </div>

                    <div class="card-mask" :style="maskStyle">
                        <el-image v-if="form.type==='pendulum'" :src="baseImage + '/card-mask-pendulum.png'" fit="cover"></el-image>
                        <el-image v-else :src="baseImage + '/card-mask.png'" fit="cover"></el-image>
                    </div>

                    <div class="left-pendulum" v-if="form.type==='pendulum'">
                        <span>{{form.pendulumScale}}</span>
                    </div>

                    <div class="right-pendulum" v-if="form.type==='pendulum'">
                        <span>{{form.pendulumScale}}</span>
                    </div>

                    <div class="pendulum-description" v-if="form.type==='pendulum'">
                        <span v-compressText="{width:950,height:220}" v-html="formatVHtml(form.pendulumDescription)"></span>
                    </div>

                    <div class="card-package" :style="packageStyle">
                        <span>{{form.package}}</span>
                    </div>

                    <div class="link-arrow" v-if="form.type==='monster'&&form.cardType==='link'">
                        <el-image :src="baseImage + '/arrow-up-on.png'" style="top: 293px;left: 569px" v-show="form.arrowList.includes(1)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-up-on.png'" style="top: 313px;left: 1141px" v-show="form.arrowList.includes(2)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-on.png'" style="top: 774px;left: 1221px" v-show="form.arrowList.includes(3)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-down-on.png'" style="top: 1347px;left: 1141px" v-show="form.arrowList.includes(4)"></el-image>
                        <el-image :src="baseImage + '/arrow-down-on.png'" style="top: 1427px;left: 569px" v-show="form.arrowList.includes(5)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-down-on.png'" style="top: 1347px;left: 109px" v-show="form.arrowList.includes(6)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-on.png'" style="top: 774px;left: 88px" v-show="form.arrowList.includes(7)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-up-on.png'" style="top: 313px;left: 109px" v-show="form.arrowList.includes(8)"></el-image>

                        <el-image :src="baseImage + '/arrow-up-off.png'" style="top: 293px;left: 569px" v-show="!form.arrowList.includes(1)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-up-off.png'" style="top: 313px;left: 1141px" v-show="!form.arrowList.includes(2)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-off.png'" style="top: 774px;left: 1221px" v-show="!form.arrowList.includes(3)"></el-image>
                        <el-image :src="baseImage + '/arrow-right-down-off.png'" style="top: 1347px;left: 1141px" v-show="!form.arrowList.includes(4)"></el-image>
                        <el-image :src="baseImage + '/arrow-down-off.png'" style="top: 1427px;left: 569px" v-show="!form.arrowList.includes(5)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-down-off.png'" style="top: 1347px;left: 109px" v-show="!form.arrowList.includes(6)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-off.png'" style="top: 771px;left: 87px" v-show="!form.arrowList.includes(7)"></el-image>
                        <el-image :src="baseImage + '/arrow-left-up-off.png'" style="top: 313px;left: 109px" v-show="!form.arrowList.includes(8)"></el-image>
                    </div>

                    <div class="card-description">
                        <div v-if="['monster','pendulum'].includes(form.type)" class="card-effect">
                            <span v-html="`【${formatVHtml(form.monsterType)}】`"></span>
                        </div>

                        <div class="description-info">
                            <template v-for="(item,index) in form.description.split('\n')">
                                <!--单行压缩-->
                                <span v-if="index<form.description.split('\n').length-1"
                                      v-compressText="{width:1170,height:50}" v-html="formatVHtml(item)"></span>
                                <!--最后一行压缩-->
                                <span v-if="index===form.description.split('\n').length-1"
                                      v-compressText="{width:1170,height:descriptionHeight}" v-html="formatVHtml(item)"></span>
                            </template>
                        </div>
                    </div>

                    <div class="atk-def-link">
                        <el-image :src="baseImage + '/atk-def.png'"
                                  v-if="(form.type==='monster'&&form.cardType!=='link')||form.type==='pendulum'"></el-image>
                        <el-image :src="baseImage + '/atk-link.png'" v-if="form.type==='monster'&&form.cardType==='link'"></el-image>
                    </div>

                    <div class="card-atk" v-if="['monster','pendulum'].includes(form.type)">
                        <span v-if="form.atk >= 0">{{form.atk}}</span>
                        <span v-else-if="form.atk === -1">?</span>
                    </div>

                    <div class="card-def" v-if="(form.type==='monster'&&form.cardType!=='link')||form.type==='pendulum'">
                        <span v-if="form.def >= 0">{{form.def}}</span>
                        <span v-else-if="form.def === -1">?</span>
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
                        <el-form-item label="语言">
                            <el-select v-model="form.language" placeholder="请选择语言" @change="changeLanguage">
                                <el-option label="简体中文" value="sc"></el-option>
                                <el-option label="繁体中文" value="tc"></el-option>
                                <el-option label="日文" value="jp"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="卡名">
                            <el-input v-model="form.name" placeholder="请输入卡名"></el-input>
                        </el-form-item>
                        <el-form-item label="颜色" style="margin-bottom: 8px">
                            <el-color-picker v-model="form.color"></el-color-picker>
                            <span class="tip" style="display: inline-block;transform:translateY(-10px)">（自动选择清空）</span>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-radio-group v-model="form.type">
                                <el-radio-button label="monster">怪兽</el-radio-button>
                                <el-radio-button label="spell">魔法</el-radio-button>
                                <el-radio-button label="trap">陷阱</el-radio-button>
                                <el-radio-button label="pendulum">灵摆</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="属性" v-if="['monster','pendulum'].includes(form.type)">
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
                        <el-form-item label="灵摆" v-if="form.type==='pendulum'">
                            <el-select v-model="form.pendulumType" placeholder="请选择灵摆">
                                <el-option label="通常／灵摆" value="normal-pendulum"></el-option>
                                <el-option label="效果／灵摆" value="effect-pendulum"></el-option>
                                <el-option label="仪式／灵摆" value="ritual-pendulum"></el-option>
                                <el-option label="融合／灵摆" value="fusion-pendulum"></el-option>
                                <el-option label="同调／灵摆" value="synchro-pendulum"></el-option>
                                <el-option label="超量／灵摆" value="xyz-pendulum"></el-option>
                                <el-option label="连接／灵摆" value="link-pendulum" v-if="false"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="星级" v-if="(form.type==='monster'&&['normal','effect','ritual','fusion','synchro','token'].includes(form.cardType))
                        ||(form.type==='pendulum'&&['normal-pendulum','effect-pendulum','ritual-pendulum','fusion-pendulum','synchro-pendulum'].includes(form.pendulumType))">
                            <el-input-number v-model="form.level" :min="0" :max="12" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="阶级" v-if="(form.type==='monster'&&form.cardType==='xyz')||(form.type==='pendulum'&&form.pendulumType==='xyz-pendulum')">
                            <el-input-number v-model="form.rank" :min="0" :max="12" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="摆值" v-if="form.type==='pendulum'">
                            <el-input-number v-model="form.pendulumScale" :min="0" :max="12" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="灵摆效果" label-width="40px" v-if="form.type==='pendulum'">
                            <el-input type="textarea" :autosize="{minRows: 3}" v-model="form.pendulumDescription"
                                      placeholder="请输入灵摆效果" @input="inputPendulumDescription"></el-input>
                        </el-form-item>
                        <el-form-item label="种族" v-if="['monster','pendulum'].includes(form.type)">
                            <el-input v-model="form.monsterType" placeholder="请输入种族"></el-input>
                        </el-form-item>
                        <el-form-item label="ATK" v-if="['monster','pendulum'].includes(form.type)">
                            <el-input-number v-model="form.atk" :min="-1" :max="9999" :precision="0"></el-input-number>
                            <span class="tip">（? 输入 -1）</span>
                        </el-form-item>
                        <el-form-item label="DEF" v-if="(form.type==='monster'&&form.cardType!=='link')||form.type==='pendulum'">
                            <el-input-number v-model="form.def" :min="-1" :max="9999" :precision="0"></el-input-number>
                            <span class="tip">（? 输入 -1）</span>
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
                            <el-input type="textarea" :autosize="{minRows: 3}" v-model="form.description"
                                      placeholder="请输入效果" @input="inputDescription"></el-input>
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
                        <el-form-item label="圆角">
                            <el-switch v-model="form.radius"></el-switch>
                        </el-form-item>
                        <el-form-item label="缩放">
                            <el-slider v-model="form.scale" :min="0.1" :max="1" :step="0.1"></el-slider>
                        </el-form-item>
                    </el-form>

                    <div class="button-group">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button plain size="medium" @click="kanjiKanaDialog = true">一键注音</el-button>
                            </el-col>
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
                </div>
            </template>

            <KanjiKanaDialog :kanjiKanaDialog.sync="kanjiKanaDialog"></KanjiKanaDialog>
        </Page>
    </div>
</template>

<script>
    import Page from '@/components/page/Page';
    import KanjiKanaDialog from '@/views/yugioh/components/KanjiKanaDialog';
    import html2canvas from 'html2canvas';
    import scDemo from './sc/sc-demo';
    import tcDemo from './tc/tc-demo';
    import jpDemo from './jp/jp-demo';

    export default {
        name: 'Yugioh',
        components: {
            Page,
            KanjiKanaDialog
        },
        data() {
            return {
                baseImage: 'https://static.kooriookami.top/yugioh/image',
                fontLoading: true,
                form: {
                    language: 'sc',
                    name: '',
                    color: '',
                    type: 'monster',
                    attribute: 'dark',
                    icon: '',
                    image: '',
                    cardType: 'normal',
                    pendulumType: 'normal-pendulum',
                    level: 0,
                    rank: 0,
                    pendulumScale: 0,
                    pendulumDescription: '',
                    monsterType: '',
                    atk: 0,
                    def: 0,
                    arrowList: [],
                    description: '',
                    package: '',
                    password: '',
                    scale: 0.5,
                    laser: false,
                    radius: false
                },
                kanjiKanaDialog: false
            };
        },
        created() {
            Object.assign(this.form, scDemo);
        },
        mounted() {
            document.fonts.ready.then(() => {
                this.fontLoading = false;
            });
        },
        methods: {
            changeLanguage(value) {
                if (value === 'sc') {
                    Object.assign(this.form, scDemo);
                } else if (value === 'tc') {
                    Object.assign(this.form, tcDemo);
                } else if (value === 'jp') {
                    Object.assign(this.form, jpDemo);
                }

                setTimeout(() => {
                    this.fontLoading = true;
                    document.fonts.ready.then(() => {
                        this.fontLoading = false;
                        // 强制更新视图
                        this.$forceUpdate();
                    });
                });
            },
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
            inputPendulumDescription() {
                // 不保留换行符号
                let list = Array.from(this.form.pendulumDescription);
                list.forEach((value, index) => {
                    if (value === '\n') {
                        this.$message.warning('不允许换行符');
                        list[index] = '';
                    }
                });
                this.form.pendulumDescription = list.join('');
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
            inputDescription() {
                // 只保留两个换行符号
                let list = Array.from(this.form.description);
                let count = 0;
                list.forEach((value, index) => {
                    if (value === '\n') {
                        count++;
                        if (count > 3) {
                            this.$message.warning('最多允许三个换行符');
                            list[index] = '';
                        }
                    }
                });
                this.form.description = list.join('');
            },
            formatVHtml(value) {
                return value.replace(/\[(.*?)\((.*?)\)]/g, '<span class="ruby">$1<span class="rt">$2</span></span>');
            },
            importJson(file) {
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (e => {
                    try {
                        let data = JSON.parse(e.target?.result);
                        this.form = Object.assign(this.form, data);
                        // 字体可能加载
                        setTimeout(() => {
                            this.fontLoading = true;
                            document.fonts.ready.then(() => {
                                this.fontLoading = false;
                                // 强制更新视图
                                this.$forceUpdate();
                            });
                        });
                    } catch (e) {
                        this.$message.error('数据导入失败');
                    }
                });
            },
            exportJson() {
                let form = this._.cloneDeep(this.form);
                // 去除图片数据
                form.image = '';
                let data = JSON.stringify(form);
                let blob = new Blob([data], {type: 'application/json'});
                this.downloadBlob(blob, this.exportFileName);
            },
            exportImage() {
                let element = document.querySelector('.yugioh-card');
                html2canvas(element, {
                    useCORS: true,
                    backgroundColor: 'transparent',
                    width: this.form.scale * 1393,
                    height: this.form.scale * 2031,
                    onclone: (doc) => {
                        // 微调字体位置
                        let leftPendulum = doc.querySelector('.left-pendulum');
                        if (leftPendulum) {
                            leftPendulum.style.top = '1363px';
                        }
                        let rightPendulum = doc.querySelector('.right-pendulum');
                        if (rightPendulum) {
                            rightPendulum.style.top = '1363px';
                        }
                        let cardAtk = doc.querySelector('.card-atk');
                        if (cardAtk) {
                            cardAtk.style.top = '1835px';
                        }
                        let cardDef = doc.querySelector('.card-def');
                        if (cardDef) {
                            cardDef.style.top = '1835px';
                        }
                        let cardLink = doc.querySelector('.card-link');
                        if (cardLink) {
                            cardLink.style.top = '1848px';
                        }
                    }
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = this.dataURLtoBlob(dataURL);
                    this.downloadBlob(blob, this.exportFileName);
                });
            }
        },
        computed: {
            cardClass() {
                return `${this.form.language}-class`;
            },
            cardStyle() {
                let background;
                if (this.form.type === 'monster') {
                    background = `url(${this.baseImage}/card-${this.form.cardType}.png) no-repeat center/cover`;
                } else if (this.form.type === 'pendulum') {
                    background = `url(${this.baseImage}/card-${this.form.pendulumType}.png) no-repeat center/cover`;
                } else {
                    background = `url(${this.baseImage}/card-${this.form.type}.png) no-repeat center/cover`;
                }
                return {
                    transform: `scale(${this.form.scale})`,
                    background: background,
                    borderRadius: this.form.radius ? '24px' : '',
                    marginRight: `${(this.form.scale - 1) * 1393}px`,
                    marginBottom: `${(this.form.scale - 1) * 2031}px`
                };
            },
            nameStyle() {
                let color;
                if (this.form.color) {
                    // 用户颜色
                    color = this.form.color;
                } else {
                    // 自动颜色
                    if (this.form.type === 'monster') {
                        if (['xyz', 'link'].includes(this.form.cardType)) {
                            color = 'white';
                        } else {
                            color = 'black';
                        }
                    } else if (this.form.type === 'pendulum') {
                        if (['xyz-pendulum', 'link-pendulum'].includes(this.form.pendulumType)) {
                            color = 'white';
                        } else {
                            color = 'black';
                        }
                    } else {
                        color = 'white';
                    }
                }

                return {
                    color: color
                };
            },
            attributeSrc() {
                let suffix = '';
                if (this.form.language === 'jp') {
                    suffix = '-jp';
                }
                if (['monster', 'pendulum'].includes(this.form.type)) {
                    return `${this.baseImage}/attribute-${this.form.attribute}${suffix}.png`;
                } else {
                    return `${this.baseImage}/attribute-${this.form.type}${suffix}.png`;
                }
            },
            spellTrapName() {
                let name = '';
                if (this.form.language === 'sc') {
                    if (this.form.type === 'spell') {
                        name = '魔法卡';
                    } else if (this.form.type === 'trap') {
                        name = '陷阱卡';
                    }
                } else if (this.form.language === 'tc') {
                    if (this.form.type === 'spell') {
                        name = '魔法卡';
                    } else if (this.form.type === 'trap') {
                        name = '陷阱卡';
                    }
                } else if (this.form.language === 'jp') {
                    if (this.form.type === 'spell') {
                        name = '[魔(ま)][法(ほう)]カード';
                    } else if (this.form.type === 'trap') {
                        name = '[罠(トラップ)]カード';
                    }
                }
                return name;
            },
            imageStyle() {
                let left, top, width, height;
                if (this.form.type === 'pendulum') {
                    left = '96px';
                    top = '367px';
                    width = '1201px';
                    height = '1201px';
                } else {
                    left = '171px';
                    top = '376px';
                    width = '1051px';
                    height = '1051px';
                }
                return {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    background: `url(${this.form.image}) no-repeat center/cover`
                };
            },
            maskStyle() {
                let left, top;
                if (this.form.type === 'pendulum') {
                    left = '81px';
                    top = '1254px';
                } else {
                    left = '168px';
                    top = '373px';
                }
                return {
                    left: left,
                    top: top
                };
            },
            packageStyle() {
                let top, left, right;
                if (this.form.type === 'pendulum') {
                    top = '1854px';
                    left = '116px';
                } else if (this.form.type === 'monster' && this.form.cardType === 'link') {
                    top = '1456px';
                    right = '252px';
                } else {
                    top = '1456px';
                    right = '148px';
                }
                return {
                    color: this.form.type === 'monster' && this.form.cardType === 'xyz' ? 'white' : 'black',
                    top: top,
                    left: left,
                    right: right
                };
            },
            descriptionHeight() {
                let height;
                let enterCount = this.form.description.split('\n').length - 1;
                if (['monster', 'pendulum'].includes(this.form.type)) {
                    // 41为一行文本高度
                    height = 260 - enterCount * 41;
                } else {
                    height = 370;
                }
                return height;
            },
            passwordStyle() {
                return {
                    color: this.form.type === 'monster' && this.form.cardType === 'xyz' ? 'white' : 'black'
                };
            },
            exportFileName() {
                return this.form.name.replace(/\[(.*?)\(.*?\)]/g, '$1');
            }
        },
        directives: {
            // 文本压缩变形
            compressText(el, binding) {
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
    @import "./sc/sc";
    @import "./tc/tc";
    @import "./jp/jp";

    .yugioh-container {
        .yugioh-card {
            width: 1393px;
            height: 2031px;
            position: relative;
            user-select: none;
            color: black;
            white-space: pre-wrap;
            transform-origin: 0 0;

            .card-name {
                position: absolute;
                font-size: 108px;
                left: 116px;
                width: 1030px;
                max-height: 130px;
                overflow: hidden;

                ::v-deep .ruby {
                    .rt {
                        font-size: 18px;
                        top: 3px;
                    }
                }
            }

            .card-attribute {
                position: absolute;
                left: 1159px;
                top: 96px;
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
                display: flex;
                align-items: center;

                ::v-deep .ruby {
                    .rt {
                        font-size: 18px;
                        top: -2px;
                    }
                }

                .el-image {
                    display: flex;
                    min-width: 72px;
                }
            }

            .card-image {
                position: absolute;
            }

            .card-mask {
                position: absolute;
                z-index: 10;
            }

            .left-pendulum {
                position: absolute;
                top: 1379px;
                left: 93px;
                width: 95px;
                font-family: ygo-atk-def, serif;
                font-size: 98px;
                text-align: center;
                letter-spacing: -10px;
                z-index: 20;
            }

            .right-pendulum {
                position: absolute;
                top: 1379px;
                right: 104px;
                width: 95px;
                font-family: ygo-atk-def, serif;
                font-size: 98px;
                text-align: center;
                letter-spacing: -10px;
                z-index: 20;
            }

            .pendulum-description {
                position: absolute;
                left: 221px;
                top: 1288px;
                width: 950px;
                text-align: justify;
                z-index: 20;

                ::v-deep .ruby {
                    .rt {
                        font-size: 12px;
                        top: -4px;
                    }
                }
            }

            .card-package {
                position: absolute;
                font-family: ygo-password, serif;
                font-size: 40px;
                z-index: 20;
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
                text-align: justify;
                z-index: 20;

                .card-effect {
                    white-space: nowrap;

                    ::v-deep .ruby {
                        .rt {
                            font-size: 14px;
                            top: -4px;
                        }
                    }
                }

                .description-info {
                    ::v-deep .ruby {
                        .rt {
                            font-size: 12px;
                            top: -4px;
                        }
                    }
                }
            }

            .atk-def-link {
                position: absolute;
                left: 109px;
                top: 1844px;
                z-index: 20;
            }

            .card-atk {
                position: absolute;
                right: 395px;
                top: 1845px;
                font-family: ygo-atk-def, serif;
                font-size: 61px;
                letter-spacing: 2px;
                z-index: 20;
            }

            .card-def {
                position: absolute;
                right: 124px;
                top: 1845px;
                font-family: ygo-atk-def, serif;
                font-size: 61px;
                letter-spacing: 2px;
                z-index: 20;
            }

            .card-link {
                position: absolute;
                right: 116px;
                top: 1846px;
                font-family: ygo-link, serif;
                font-size: 54px;
                letter-spacing: 2px;
                z-index: 20;
            }

            .card-password {
                position: absolute;
                left: 66px;
                top: 1930px;
                font-family: ygo-password, serif;
                font-size: 40px;
            }

            .card-laser {
                position: absolute;
                left: 1276px;
                top: 1913px;
            }

            ::v-deep .ruby {
                position: relative;

                .rt {
                    font-family: ygo-tip, sans-serif;
                    font-size: 16px;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    white-space: pre;
                    letter-spacing: 0;
                    text-indent: 0;
                }
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

            .button-group {
                .el-row {
                    margin-top: -20px;

                    .el-col {
                        margin-top: 20px;

                        ::v-deep .el-upload {
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
