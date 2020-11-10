<template>
    <div class="kanji-kana-dialog">
        <el-dialog title="一键注音" :visible="kanjiKanaDialog" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="form" :model="form" label-position="top" size="small">
                <el-form-item label="注音只支持 OCG 常用语" prop="text">
                    <el-input type="textarea" :autosize="{minRows: 3}" v-model="form.text" placeholder="请输入文本"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button plain size="medium" @click="closeDialog">关闭</el-button>
                <el-button type="primary" size="medium" @click="addKana">注音</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'KanjiKanaDialog',
        props: ['kanjiKanaDialog'],
        data() {
            return {
                kanjiKanaMap: require('@/assets/json/kanji-kana.json'),
                form: {
                    text: ''
                }
            };
        },
        methods: {
            closeDialog() {
                this.resetForm('form');
                this.$emit('update:kanjiKanaDialog', false);
            },
            addKana() {
                let text = this.fullToHalf(this.form.text);
                // 重新排序kanjiKanaMap，最长key的放在最前
                let kanjiKanaReg = new RegExp(Object.keys(this.kanjiKanaMap).sort((a, b) => b.length - a.length).join('|'), 'g');
                this.form.text = text.replace(/\[.*?\(.*?\)]/g, s => `|${s}|`).split('|').filter(value => value).map(value => {
                    if (!/\[.*?\(.*?\)]/g.test(value)) {
                        return value.replace(kanjiKanaReg, s => this.kanjiKanaMap[s]);
                    }
                    return value;
                }).join('');
                // 复制到剪切板
                this.$copyText(this.form.text).then(() => {
                    this.$message.success('已复制到剪切板');
                });
            },
            // 英文字母全角转半角
            fullToHalf(value) {
                // 全角A：65313，半角A：65
                // 全角Z：65338，半角Z：90
                // 全角a：65345，半角a：97
                // 全角z：65370，半角z：122
                // 全角-半角=65248
                let charList = Array.from(value).map(char => {
                    let code = char.charCodeAt();
                    if ((code >= 65313 && code <= 65338) || (code >= 65345 && code <= 65370)) {
                        return String.fromCharCode(code - 65248);
                    }
                    return char;
                });
                return charList.join('');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .kanji-kana-dialog {

    }
</style>