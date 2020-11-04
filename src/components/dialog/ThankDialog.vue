<template>
    <div class="thank-dialog-container">
        <el-dialog title="感谢" :visible="thankDialog" width="500px" :before-close="closeDialog">
            <div class="thank-main">
                <p>😃以下为赞助列表，感谢大家的支持！😄（按时间排序）</p>
                <div class="thank-list">
                    <el-scrollbar class="scrollbar">
                        <p class="thank-item" v-for="item in thankList">
                            <span>{{item.name}}</span>
                            <span>{{item.time}}</span>
                        </p>
                    </el-scrollbar>
                </div>
            </div>
            <div slot="footer">
                <el-button plain size="medium" @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'ThankDialog',
        props: ['thankDialog'],
        data() {
            return {
                thankList: require('@/assets/json/thank-list.json')
            };
        },
        methods: {
            closeDialog() {
                this.$emit('update:thankDialog', false);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .thank-dialog-container {
        .thank-main {
            margin: -10px 0;

            p {
                line-height: 1.7;
                margin: 10px 0;
            }

            .thank-list {
                ::v-deep .scrollbar {
                    .el-scrollbar__wrap {
                        max-height: 300px;
                        margin-bottom: 0 !important;
                    }
                }

                .thank-item {
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }
</style>
