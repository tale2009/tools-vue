<template>
    <div class="app-layout-container">
        <el-header>

        </el-header>

        <el-container>
            <el-aside class="left-aside" width="200px">
                <el-scrollbar ref="left-scrollbar" class="scrollbar">

                </el-scrollbar>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'AppLayout',
        mounted() {
            addEventListener('resize', this.updateScrollbar);
        },
        destroyed() {
            removeEventListener('resize', this.updateScrollbar);
        },
        methods: {
            updateScrollbar() {
                this.$refs['left-scrollbar'].update();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .app-layout-container {
        .el-header {
            border-bottom: 1px solid $border-color;
        }

        .el-container {
            height: calc(100vh - 60px);

            .left-aside {
                border-right: 1px solid $border-color;
            }

            .el-main {
                padding: 0;
            }
        }
    }
</style>