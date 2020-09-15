<template>
    <div class="page-container">
        <div class="page-main">
            <el-scrollbar ref="main-scrollbar" class="scrollbar">
                <div class="page-slot">
                    <slot></slot>
                </div>
            </el-scrollbar>
        </div>
        <div v-show="$slots.form" class="page-form">
            <el-scrollbar ref="right-scrollbar" class="scrollbar">
                <slot name="form"></slot>
            </el-scrollbar>
        </div>
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
        height: calc(100vh - 60px);
        display: flex;

        .page-main {
            height: 100%;
            overflow: auto;
            flex-grow: 1;

            .page-slot {
                padding: 20px;
                display: inline-block;
            }
        }

        .page-form {
            height: 100%;
            width: 400px;
            flex-shrink: 0;
            border-left: 1px solid $border-color;
        }
    }
</style>
