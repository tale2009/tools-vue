<template>
    <div class="yugioh-container">
        <Page>
            <template #default>
                <div class="yugioh-card" :class="cardClass" :style="cardStyle" ondragstart="return false">
                    <div class="card-name" v-name-color="form.color">
                        <CompressText :text="form.name" :fontLoading="fontLoading" :width="1030" :height="200"></CompressText>
                    </div>

                    <div class="card-attribute">
                        <el-image :src="attributeSrc"></el-image>
                    </div>

                    <div class="card-level" v-if="showLevel" :style="levelStyle">
                        <el-image v-for="item in form.level" :src="baseImage + '/level.png'"></el-image>
                    </div>

                    <div class="card-rank" v-if="showRank" :style="rankStyle">
                        <el-image v-for="item in form.rank" :src="baseImage + '/rank.png'"></el-image>
                    </div>

                    <div class="spell-trap" v-if="['spell','trap'].includes(form.type)">
                        <span>{{['en', 'kr'].includes(form.language) ? '[' : '【'}}</span>
                        <CompressText :text="spellTrapName" :fontLoading="fontLoading"></CompressText>
                        <el-image class="spell-trap-icon" v-if="form.icon" :src="`${baseImage}/icon-${form.icon}.png`"></el-image>
                        <span>{{['en', 'kr'].includes(form.language) ? ']' : '】'}}</span>
                    </div>

                    <div class="card-image" v-if="form.image" :style="imageStyle">
                        <el-image :src="form.image">
                            <template #placeholder>
                                <div class="image-slot">
                                    <i class="fal fa-spinner fa-pulse"></i>
                                </div>
                            </template>
                            <template #error>
                                <div class="image-slot">
                                    <i class="fal fa-image"></i>
                                </div>
                            </template>
                        </el-image>
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
                        <CompressText :text="form.pendulumDescription" :width="950" :height="230" :fontLoading="fontLoading"></CompressText>
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

                    <div class="card-description" v-card-description>
                        <div v-if="['monster','pendulum'].includes(form.type)" class="card-effect">
                            <CompressText :text="monsterType" :fontLoading="fontLoading"></CompressText>
                        </div>

                        <div class="description-info" :style="descriptionStyle">
                            <template v-for="(item,index) in form.description.split('\n')">
                                <!--判断首行是否压缩-->
                                <div v-if="index === 0 && form.firstLineCompress">
                                    <CompressText :text="item" :width="1170" :height="70" :fontLoading="fontLoading"></CompressText>
                                </div>
                                <!--单行不压缩-->
                                <div v-else-if="index < form.description.split('\n').length - 1">
                                    <CompressText :text="item" :fontLoading="fontLoading"></CompressText>
                                </div>
                                <!--最后一行压缩-->
                                <div v-else-if="index === form.description.split('\n').length - 1" class="last-description">
                                    <CompressText :text="item" :width="1170" :height="lastDescriptionHeight" :fontLoading="fontLoading"
                                                  :language="form.language" autoSizeElement=".card-description"></CompressText>
                                </div>
                                <!--item为空提供换行-->
                                <br v-if="!item">
                            </template>
                        </div>
                    </div>

                    <div class="atk-def-link">
                        <el-image :src="baseImage + '/atk-def.svg'"
                                  v-if="(form.type==='monster'&&form.cardType!=='link')||form.type==='pendulum'"></el-image>
                        <el-image :src="baseImage + '/atk-link.svg'" v-if="form.type==='monster'&&form.cardType==='link'"></el-image>
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

                    <div class="card-copyright" v-if="form.copyright">
                        <el-image :src="copyrightSrc"></el-image>
                    </div>

                    <div class="card-laser" v-if="form.laser">
                        <el-image :src="baseImage + '/laser.png'"></el-image>
                    </div>
                </div>
            </template>

            <template #form>
                <PageForm title="游戏王卡片生成器" description="最大尺寸 1393 px * 2031 px，卡模素材 by 怀特索尔">
                    <div class="font-loading" v-if="fontLoading">
                        <i class="el-icon-loading"></i>
                        <span>字体加载中...</span>
                    </div>

                    <el-form :model="form" label-width="auto" size="small">
                        <el-form-item label="语言">
                            <el-select v-model="form.language" placeholder="请选择语言" @change="changeLanguage">
                                <el-option label="简体中文" value="sc"></el-option>
                                <el-option label="繁体中文" value="tc"></el-option>
                                <el-option label="日文" value="jp"></el-option>
                                <el-option label="韩文" value="kr"></el-option>
                                <el-option label="英文" value="en"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="卡名">
                            <el-autocomplete v-model="form.name" :fetch-suggestions="fetchCardName" placeholder="请输入卡名" @select="selectCardName"></el-autocomplete>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-color-picker v-model="form.color"></el-color-picker>
                            <span class="tip">（自动选择清空）</span>
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
                            <el-select v-model="form.icon" placeholder="请选择图标" clearable>
                                <el-option label="装备" value="equip"></el-option>
                                <el-option label="场地" value="filed"></el-option>
                                <el-option label="速攻" value="quick-play"></el-option>
                                <el-option label="仪式" value="ritual"></el-option>
                                <el-option label="永续" value="continuous"></el-option>
                                <el-option label="反击" value="counter"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="图片">
                            <el-space :size="10">
                                <el-upload action="/" :show-file-list="false" accept="image/*" :before-upload="beforeUpload">
                                    <el-button type="primary">选择图片</el-button>
                                </el-upload>
                                <el-button plain @click="deleteImage">删除</el-button>
                            </el-space>
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
                            </el-select>
                        </el-form-item>
                        <el-form-item label="星级" v-if="showLevel">
                            <el-input-number v-model="form.level" :min="0" :max="13" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="阶级" v-if="showRank">
                            <el-input-number v-model="form.rank" :min="0" :max="13" :precision="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="刻度" v-if="form.type==='pendulum'">
                            <el-input-number v-model="form.pendulumScale" :min="0" :max="13" :precision="0"></el-input-number>
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
                            <el-switch v-model="form.firstLineCompress" active-text="首行压缩"></el-switch>
                            <el-input style="margin-top: 10px" type="textarea" :autosize="{minRows: 3}" v-model="form.description" placeholder="请输入效果"></el-input>
                        </el-form-item>
                        <el-form-item label="卡包">
                            <el-input v-model="form.package" placeholder="请输入卡包"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <div style="display: flex">
                                <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                                <el-button style="margin-left: 10px" type="primary" :loading="searchLoading" @click="searchCardByPassword">搜索</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="版权">
                            <el-select v-model="form.copyright" placeholder="请选择版权" clearable>
                                <el-option label="简体中文" value="sc"></el-option>
                                <el-option label="日文" value="jp"></el-option>
                                <el-option label="英文" value="en"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="角标">
                                    <el-switch v-model="form.laser"></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="圆角">
                                    <el-switch v-model="form.radius"></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="卡背">
                                    <el-switch v-model="form.cardBack"></el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="缩放">
                            <el-slider v-model="form.scale" :min="0.1" :max="1" :step="0.1"></el-slider>
                        </el-form-item>
                    </el-form>

                    <div class="button-group">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-button plain size="medium" @click="kanjiKanaDialog = true">一键注音</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button plain size="medium" :loading="randomLoading" @click="getRandomCard">随机生成</el-button>
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
                                <el-button type="primary" size="medium" :loading="exportLoading" @click="exportImage">导出图片</el-button>
                            </el-col>
                        </el-row>
                    </div>

                    <KanjiKanaDialog v-model="kanjiKanaDialog"></KanjiKanaDialog>
                </PageForm>
            </template>
        </Page>
    </div>
</template>

<script>
    import Page from '@/components/page/Page';
    import PageForm from '@/components/page/PageForm';
    import CompressText from '@/views/yugioh/components/CompressText';
    import KanjiKanaDialog from '@/views/yugioh/components/KanjiKanaDialog';
    import html2canvas from '@/assets/js/html2canvas';
    import loadImage from 'blueimp-load-image';
    import scDemo from './demo/sc-demo';
    import tcDemo from './demo/tc-demo';
    import jpDemo from './demo/jp-demo';
    import krDemo from './demo/kr-demo';
    import enDemo from './demo/en-demo';

    export default {
        name: 'Yugioh',
        components: {
            Page,
            PageForm,
            CompressText,
            KanjiKanaDialog
        },
        data() {
            return {
                baseImage: 'https://static.kooriookami.top/yugioh/image',
                fontLoading: true,
                searchLoading: false,
                randomLoading: false,
                exportLoading: false,
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
                    firstLineCompress: false,
                    package: '',
                    password: '',
                    copyright: '',
                    laser: false,
                    radius: false,
                    cardBack: false,
                    scale: 0.5
                },
                lastDescriptionHeight: 300,   // 最后一行效果压缩高度
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
            // 刷新字体
            refreshFont() {
                setTimeout(() => {
                    this.fontLoading = true;
                    document.fonts.ready.then(() => {
                        this.fontLoading = false;
                    });
                });
            },
            changeLanguage(value) {
                if (value === 'sc') {
                    Object.assign(this.form, scDemo);
                } else if (value === 'tc') {
                    Object.assign(this.form, tcDemo);
                } else if (value === 'jp') {
                    Object.assign(this.form, jpDemo);
                } else if (value === 'kr') {
                    Object.assign(this.form, krDemo);
                } else if (value === 'en') {
                    Object.assign(this.form, enDemo);
                }
                this.refreshFont();
            },
            beforeUpload(file) {
                let flag = file.type.includes('image');
                if (flag) {
                    loadImage(file, {
                        canvas: true,
                        top: 0,
                        aspectRatio: 1
                    }).then(data => {
                        this.form.image = data.image.toDataURL('image/png', 1);
                    });
                } else {
                    this.$message.warning('请选择正确图片格式');
                }
                return false;
            },
            deleteImage() {
                this.form.image = '';
            },
            inputPendulumDescription() {
                // 不保留换行符号
                if (this.form.pendulumDescription.includes('\n')) {
                    this.$message.warning('不允许换行符');
                    this.form.pendulumDescription = this.form.pendulumDescription.replace('\n', '');
                }
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
            // 获取最后一行效果的压缩高度
            getLastDescriptionHeight() {
                let lastDescription = document.querySelector('.last-description');
                if (lastDescription) {
                    if (['monster', 'pendulum'].includes(this.form.type)) {
                        this.lastDescriptionHeight = 330 - lastDescription.offsetTop;
                    } else {
                        this.lastDescriptionHeight = 380 - lastDescription.offsetTop;
                    }
                    if (this.lastDescriptionHeight <= 40) {
                        this.$message.warning('文本超过可压缩高度');
                    }
                } else {
                    this.lastDescriptionHeight = 0;
                }
            },
            fetchCardName(value, callback) {
                if (value) {
                    this.axios({
                        method: 'get',
                        url: '/yugioh/card',
                        params: {
                            name: this.cardName,
                            lang: this.form.language
                        }
                    }).then(res => {
                        let data = res.data.data;
                        data.forEach(value => {
                            value.value = `${value.name}（${value.id}）`;
                        });
                        callback(data);
                    });
                }
                callback([]);
            },
            selectCardName(value) {
                this.form.name = value.name;
                this.form.password = value.id;
                this.searchCardByPassword();
            },
            searchCardByPassword() {
                this.searchLoading = true;
                this.axios({
                    method: 'get',
                    url: '/yugioh/card/' + this.form.password,
                    params: {
                        lang: this.form.language
                    }
                }).then(res => {
                    let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
                    Object.assign(this.form, cardInfo);
                }).finally(() => {
                    this.searchLoading = false;
                });
            },
            getRandomCard() {
                this.randomLoading = true;
                this.axios({
                    method: 'get',
                    url: '/yugioh/random-card',
                    params: {
                        lang: this.form.language
                    }
                }).then(res => {
                    let cardInfo = this.parseYugiohCard(res.data.data, this.form.language);
                    Object.assign(this.form, cardInfo);
                }).finally(() => {
                    this.randomLoading = false;
                });
            },
            importJson(file) {
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (e => {
                    try {
                        let data = JSON.parse(e.target?.result);
                        this.form = Object.assign(this.form, data);
                        // 字体可能加载
                        this.refreshFont();
                    } catch (e) {
                        this.$message.error('数据导入失败');
                    }
                });
            },
            exportJson() {
                let data = JSON.stringify(this.form);
                let blob = new Blob([data], {type: 'application/json'});
                this.downloadBlob(blob, this.cardName);
            },
            exportImage() {
                this.exportLoading = true;
                let element = document.querySelector('.yugioh-card');
                html2canvas(element, {
                    useCORS: true,
                    backgroundColor: 'transparent',
                    width: this.form.scale * 1393,
                    height: this.form.scale * 2031
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png', 1);
                    let blob = this.dataURLtoBlob(dataURL);
                    this.downloadBlob(blob, this.cardName);
                }).finally(() => {
                    this.exportLoading = false;
                });
            }
        },
        computed: {
            cardClass() {
                return `${this.form.language}-class ${this.form.cardBack ? 'card-back' : ''}`;
            },
            cardStyle() {
                let background;
                if (this.form.cardBack) {
                    background = `url(${this.baseImage}/card-back.png) no-repeat center/cover`;
                } else if (this.form.type === 'monster') {
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
            attributeSrc() {
                let suffix = '';
                if (this.form.language === 'jp') {
                    suffix = '-jp';
                } else if (this.form.language === 'kr') {
                    suffix = '-kr';
                } else if (this.form.language === 'en') {
                    suffix = '-en';
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
                } else if (this.form.language === 'kr') {
                    if (this.form.type === 'spell') {
                        name = '마법 카드';
                    } else if (this.form.type === 'trap') {
                        name = '함정 카드';
                    }
                } else if (this.form.language === 'en') {
                    if (this.form.type === 'spell') {
                        name = 'Spell Card';
                    } else if (this.form.type === 'trap') {
                        name = 'Trap Card';
                    }
                }
                return name;
            },
            showLevel() {
                let flag = false;
                if (this.form.type === 'monster') {
                    flag = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'token'].includes(this.form.cardType);
                } else if (this.form.type === 'pendulum') {
                    flag = ['normal-pendulum', 'effect-pendulum', 'ritual-pendulum', 'fusion-pendulum', 'synchro-pendulum'].includes(this.form.pendulumType);
                }
                return flag;
            },
            showRank() {
                let flag = false;
                if (this.form.type === 'monster') {
                    flag = this.form.cardType === 'xyz';
                } else if (this.form.type === 'pendulum') {
                    flag = this.form.pendulumType === 'xyz-pendulum';
                }
                return flag;
            },
            levelStyle() {
                let right;
                if (this.form.level < 13) {
                    right = '146px';
                } else {
                    right = '100px';
                }
                return {
                    right: right
                };
            },
            rankStyle() {
                let left;
                if (this.form.rank < 13) {
                    left = '147px';
                } else {
                    left = '100px';
                }
                return {
                    left: left
                };
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
                    height: height
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
                    top = '1455px';
                    right = '252px';
                } else {
                    top = '1455px';
                    right = '148px';
                }
                return {
                    color: this.form.type === 'monster' && this.form.cardType === 'xyz' ? 'white' : 'black',
                    top: top,
                    left: left,
                    right: right
                };
            },
            descriptionStyle() {
                let fontFamily;
                if (this.form.language === 'en') {
                    if ((this.form.type === 'monster' && this.form.cardType === 'normal') ||
                        (this.form.type === 'pendulum' && this.form.pendulumType === 'normal-pendulum')) {
                        fontFamily = 'ygo-en-italic';
                    }
                }
                return {
                    fontFamily: fontFamily
                };
            },
            passwordStyle() {
                return {
                    color: this.form.type === 'monster' && this.form.cardType === 'xyz' ? 'white' : 'black'
                };
            },
            monsterType() {
                const leftBracket = ['en', 'kr'].includes(this.form.language) ? '[' : '【';
                const rightBracket = ['en', 'kr'].includes(this.form.language) ? ']' : '】';
                return `${leftBracket}${this.form.monsterType}${rightBracket}`;

            },
            copyrightSrc() {
                let color = this.form.type === 'monster' && this.form.cardType === 'xyz' ? 'white' : 'black';
                return `${this.baseImage}/copyright-${this.form.copyright}-${color}.svg`;
            },
            cardName() {
                return this.form.name.replace(/\[(.*?)\(.*?\)]/g, '$1');
            }
        },
        directives: {
            nameColor(el, binding) {
                let that = binding.instance;
                // 文本和注音颜色分开控制
                let color = 'black';
                // 自动颜色
                if ((that.form.type === 'monster' && ['xyz', 'link'].includes(that.form.cardType)) || ['spell', 'trap'].includes(that.form.type) ||
                    (that.form.type === 'pendulum' && ['xyz-pendulum', 'link-pendulum'].includes(that.form.pendulumType))) {
                    color = 'white';
                }
                el.style.color = binding.value || color;
                let rtList = el.querySelectorAll('.rt');
                rtList.forEach(rt => {
                    rt.style.color = color;
                });
            },
            cardDescription(el, binding) {
                let that = binding.instance;
                that.getLastDescriptionHeight();
            }
        },
        watch: {
            // 图片转base64
            'form.image'() {
                if (this.form.image && !this.form.image.startsWith('data:image')) {
                    loadImage(this.form.image, {
                        canvas: true,
                        top: 0,
                        aspectRatio: 1,
                        crossOrigin: 'Anonymous'
                    }).then(data => {
                        this.form.image = data.image.toDataURL('image/png', 1);
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "./style";
</style>
