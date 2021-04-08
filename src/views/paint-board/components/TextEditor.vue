<template>
    <div ref="textEditor" class="text-editor">
        <textarea ref="textarea" rows="5" cols="50" placeholder="请输入内容" v-model="form.editText" :style="textareaStyle"></textarea>

        <el-space class="text-operate" :size="5">
            <el-select style="width: 80px" v-model="form.editFontSize" size="mini">
                <el-option v-for="item in fontSizeList" :label="`${item} px`" :value="item"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="confirmInput">完成</el-button>
        </el-space>
    </div>
</template>

<script>
    export default {
        name: 'TextEditor',
        props: ['form', 'context'],
        data() {
            return {
                fontSizeList: [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]
            };
        },
        methods: {
            confirmInput() {
                const textEditor = this.$refs.textEditor;
                const left = parseInt(textEditor.style.left);
                const top = parseInt(textEditor.style.top);
                const textList = this.form.editText.split('\n');

                this.context.beginPath();
                this.context.fillStyle = this.form.color;
                this.context.textBaseline = 'top';
                this.context.font = `${this.form.editFontSize}px auto`;
                textList.forEach((text, index) => {
                    this.context.fillText(text, left, top + index * this.form.editFontSize * 1.5);
                });
                this.context.closePath();
                this.form.editing = false;
                this.form.editText = '';
            }
        },
        computed: {
            textareaStyle() {
                return {
                    color: this.form.color,
                    fontSize: `${this.form.editFontSize}px`
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .text-editor {
        position: absolute;
        top: 0;
        left: 0;

        textarea {
            display: block;
            white-space: nowrap;
            border: 1px dashed $primary-color;
            padding: 0;
            outline: none;
            line-height: 1.5;
            background: transparent;
        }

        .text-operate {
            margin-top: 5px;
        }
    }
</style>
