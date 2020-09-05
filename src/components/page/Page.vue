<template>
    <div class="page-container">
        <el-container>
            <el-main>
                <el-scrollbar ref="main-scrollbar" class="scrollbar">
                    <div style="padding: 20px">
                        <slot></slot>
                    </div>
                </el-scrollbar>
            </el-main>
            <el-aside v-show="$slots.form" class="right-aside" width="400px">
                <el-scrollbar ref="right-scrollbar" class="scrollbar">
                    <slot name="form"></slot>
                </el-scrollbar>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'Page',
        mounted() {
            addEventListener('resize', this.updateScrollbar);
        },
        destroyed() {
            removeEventListener('resize', this.updateScrollbar);
        },
        methods: {
            updateScrollbar() {
                this.$refs['main-scrollbar'].update();
                this.$refs['right-scrollbar'].update();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .page-container {
        .el-container {
            height: calc(100vh - 60px);

            .el-main {
                padding: 0;
            }

            .right-aside {
                border-left: 1px solid $border-color;
            }
        }
    }
</style>