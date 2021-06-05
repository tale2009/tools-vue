<template>
    <div class="about-dialog-container">
        <el-dialog title="关于 & 赞助" :modelValue="modelValue" width="500px" :before-close="closeDialog">
            <div class="about-main">
                <p>🎉喜欢这个小工具，可以收藏并给个 star 哦。🎉</p>
                <p>如果你愿意，可以请我吃块巧克力🍫，喝杯咖啡☕，记得留下你的名字。</p>
                <p>欢迎赞助：
                    <el-popover width="400" trigger="hover">
                        <el-image :src="require('@/assets/image/ali-qr.jpg')"></el-image>
                        <template #reference>
                            <el-button type="text">支付宝</el-button>
                        </template>
                    </el-popover>
                    <el-popover width="400" trigger="hover">
                        <el-image :src="require('@/assets/image/wx-qr.png')"></el-image>
                        <template #reference>
                            <el-button type="text">微信</el-button>
                        </template>
                    </el-popover>
                </p>
                <p>使用教程：
                    <el-button type="text" @click="toCourse">B站文集</el-button>
                </p>
                <p>更新时间：{{timeFilter(config.updateTime)}}</p>
            </div>
            <template #footer>
                <el-button plain size="medium" @click="closeDialog">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'AboutDialog',
        props: ['modelValue'],
        methods: {
            closeDialog() {
                this.$emit('update:modelValue', false);
            },
            toCourse() {
                open('https://www.bilibili.com/read/readlist/rl314448');
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

                .el-button {
                    padding: 0;
                    min-height: auto;
                }
            }
        }
    }
</style>
