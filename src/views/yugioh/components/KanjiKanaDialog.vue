<template>
    <div class="kanji-kana-dialog">
        <el-dialog title="汉字注音" :visible="kanjiKanaDialog" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="form" :model="form" label-position="top" size="small">
                <el-form-item label="注音只支持常用语" prop="text">
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
                this.$emit('update:kanjiKanaDialog', false);
            },
            addKana() {
                // 重新排序kanjiKanaMap，最长key的放在最前
                // this.form.text.replace(/\[.*?\(.*?\)]/g, s => {
                //     console.log(s);
                // });
                let keyList = Object.keys(this.kanjiKanaMap).sort((a, b) => b.length - a.length);
                this.form.text = this.form.text.replace(new RegExp(keyList.join('|'), 'g'), s => this.kanjiKanaMap[s]);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .kanji-kana-dialog {

    }
</style>