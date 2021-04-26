<template>
    <div class="page-container">
        <div class="page-main">
            <el-scrollbar>
                <div class="page-slot">
                    <slot></slot>
                </div>
            </el-scrollbar>
        </div>
        <div v-show="$slots.form" class="page-form" :style="formStyle">
            <el-scrollbar>
                <slot name="form"></slot>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'Page',
        data() {
            return {
                collapse: false
            };
        },
        computed: {
            ...mapState(['rightCollapse']),
            formStyle() {
                return {
                    marginRight: this.rightCollapse ? '-400px' : '0'
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .page-container {
        height: calc(100vh - 60px);
        display: flex;
        overflow: hidden;

        .page-main {
            height: 100%;
            overflow: auto;
            flex-grow: 1;

            .page-slot {
                display: inline-flex;
                flex-wrap: wrap;
                vertical-align: top;
                padding: 20px;
            }
        }

        .page-form {
            height: 100%;
            width: 400px;
            flex-shrink: 0;
            border-left: 1px solid $border-color;
            transition: all 0.3s;
        }
    }
</style>
