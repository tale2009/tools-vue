<template>
    <div class="paint-board-container">
        <Page>
            <template #default>
                <div class="paint-board" :style="paintBoardStyle">
                    <canvas ref="canvas"></canvas>
                    <TextEditor ref="textEditor" :form="form" :context="context" @confirm="saveHistory"></TextEditor>
                </div>
            </template>

            <template #form>
                <PageForm title="画图板">
                    <el-button-group class="form-bar">
                        <el-button plain icon="fas fa-undo" size="small" @click="undoHistory" :disabled="!historyList.length"></el-button>
                        <el-popconfirm title="是否清空画板？" @confirm="clearPaintBoard">
                            <template #reference>
                                <el-button type="danger" icon="fas fa-trash" size="small"></el-button>
                            </template>
                        </el-popconfirm>
                    </el-button-group>

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
                                <el-check-tag :checked="form.type === 'bucket'" @change="changeType('bucket')" v-if="false">油漆桶</el-check-tag>
                                <el-check-tag :checked="form.type === 'text'" @change="changeType('text')">文本</el-check-tag>
                                <el-check-tag :checked="form.type === 'eraser'" @change="changeType('eraser')">橡皮擦</el-check-tag>
                                <el-check-tag :checked="form.type === 'absorber'" @change="changeType('absorber')">吸色器</el-check-tag>
                                <el-tooltip content="线宽可以控制橡皮擦大小" placement="top">
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </el-space>
                        </el-form-item>
                        <el-form-item label="形状">
                            <el-space :size="10" wrap>
                                <el-check-tag :checked="form.type === 'straight'" @change="changeType('straight')">直线</el-check-tag>
                                <el-check-tag :checked="form.type === 'rectangle'" @change="changeType('rectangle')">矩形</el-check-tag>
                                <el-check-tag :checked="form.type === 'ellipse'" @change="changeType('ellipse')">椭圆形</el-check-tag>
                                <el-tooltip content="按住 Shift 画图试试" placement="top">
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </el-space>
                        </el-form-item>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="颜色">
                                    <el-color-picker v-model="form.color"></el-color-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="填充">
                                    <el-color-picker v-model="form.fillColor"></el-color-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="线宽">
                            <el-slider v-model="form.lineWidth" :min="1" :max="30"></el-slider>
                        </el-form-item>
                    </el-form>

                    <el-button style="width: 100%" type="primary" size="medium" @click="exportImage">导出图片</el-button>
                </PageForm>
            </template>
        </Page>
    </div>
</template>

<script>
    import Page from '@/components/page/Page';
    import PageForm from '@/components/page/PageForm';
    import {computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref} from 'vue';
    import html2canvas from 'html2canvas';
    import usePaint from '@/views/paint-board/use-paint';
    import TextEditor from '@/views/paint-board/components/TextEditor';

    export default {
        name: 'PaintBoard',
        components: {
            Page,
            PageForm,
            TextEditor
        },
        setup() {
            const {proxy} = getCurrentInstance();
            const canvas = ref(null);
            const context = ref(null);
            const textEditor = ref(null);
            const form = reactive({
                width: 1920,
                height: 1080,
                type: 'pencil',
                color: '#000',
                fillColor: '',
                lineWidth: 3,
                editing: false,
                editText: '', // 编辑文字
                editFontSize: 14, // 编辑文字大小
                editPosition: {}    // 编辑框位置
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
                addEventListener('keydown', registerShortcut);
            });

            onBeforeUnmount(() => {
                canvas.value.removeEventListener('mousedown', onMousedown);
                removeEventListener('keydown', registerShortcut);
            });

            const createPaintBoard = () => {
                context.value = canvas.value.getContext('2d');

                canvas.value.width = form.width;
                canvas.value.height = form.height;

                canvas.value.addEventListener('mousedown', onMousedown);
            };

            const registerShortcut = e => {
                if (document.activeElement.nodeName === 'INPUT') {
                    return;
                }

                const {ctrlKey, key} = e;
                if (ctrlKey && key === 'z') {
                    undoHistory();
                    e.preventDefault();
                }
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
                textEditor.value.cancelInput();
            };

            const saveHistory = () => {
                const history = context.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
                historyList.value.push(history);
            };

            const undoHistory = () => {
                const history = historyList.value.pop();
                if (history) {
                    context.value.putImageData(history, 0, 0);
                }
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
                if (!['text', 'absorber'].includes(form.type)) {
                    saveHistory();
                }
                downPoint.value = {x, y};
                lastPoint.value = {x, y};
                form.editing = true;
                usePaint(usePaintKey, form.type, e);

                document.onselectstart = () => false;
                document.ondragstart = () => false;
            };

            const onMousemove = e => {
                const x = e.offsetX;
                const y = e.offsetY;
                if (e.target === canvas.value) {
                    if (!['text', 'bucket'].includes(form.type)) {
                        usePaint(usePaintKey, form.type, e);
                    }
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
                    canvas.toBlob(blob => {
                        proxy.downloadBlob(blob, '画图板');
                    });
                });
            };

            return {
                canvas,
                context,
                textEditor,
                form,
                historyList,
                paintBoardStyle,
                undoHistory,
                clearPaintBoard,
                resetSize,
                changeType,
                saveHistory,
                exportImage
            };
        }
    };
</script>

<style lang="scss" scoped>
    .paint-board-container {
        .paint-board {
            position: relative;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            display: inline-flex;
            flex-wrap: wrap;
            vertical-align: top;
        }

        .form-main {
            .form-bar {
                margin-bottom: 20px;
            }
        }
    }
</style>
