<template>
    <div class="about-dialog-container">
        <el-dialog title="关于 & 赞助" :visible="aboutDialog" width="500px" :before-close="closeDialog">
            <div class="about-main">
                <p>🎉喜欢这个小工具，可以收藏并给个 star 哦。🎉</p>
                <p>如果你愿意，可以请我吃块巧克力🍫，喝杯咖啡☕，记得留下你的名字。</p>
                <p>欢迎赞助：
                    <el-popover width="400" trigger="hover">
                        <el-image :src="require('@/assets/image/ali-qr.jpg')"></el-image>
                        <el-link style="margin-right: 10px" type="primary" :underline="false" slot="reference">支付宝</el-link>
                    </el-popover>
                    <el-popover width="400" trigger="hover">
                        <el-image :src="require('@/assets/image/wx-qr.png')"></el-image>
                        <el-link type="primary" :underline="false" slot="reference">微信</el-link>
                    </el-popover>
                </p>
                <p>最后更新时间：{{config.updateTime|timeFilter}}</p>
            </div>
            <div slot="footer">
                <el-button plain size="medium" @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'AboutDialog',
        props: ['aboutDialog'],
        methods: {
            closeDialog() {
                this.$emit('update:aboutDialog', false);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .about-dialog-container {
        .about-main {
            margin: -10px 0;

            p {
                line-height: 1.7;
                margin: 10px 0;
            }
        }
    }
</style>
