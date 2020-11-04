<template>
    <div class="app-left-container">
        <el-row>
            <el-col :span="12" v-for="(item,index) in toolList" :key="index">
                <div class="item-main" :style="itemStyle(item)" @click="toPath(item)">
                    <div class="item-icon">
                        <i :class="`fal ${item.icon}`"></i>
                    </div>
                    <div class="item-title">
                        <span>{{item.title}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'AppLeft',
        data() {
            return {
                toolList: require('@/assets/json/tool-list.json')
            };
        },
        methods: {
            toPath(item) {
                this.$router.push(item.path);
            },
            itemStyle(item) {
                let isRoute = this.$route.path.includes(item.path);
                return {
                    color: isRoute ? '#409eff' : ''
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .app-left-container {
        padding: 10px;

        .el-row {
            .el-col {
                .item-main {
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 12px;
                    cursor: pointer;

                    .item-icon {
                        font-size: 24px;
                    }

                    .item-title {
                        margin-top: 10px;
                    }

                    &:hover {
                        background: #ecf5ff;
                    }
                }
            }
        }
    }
</style>