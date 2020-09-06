<template>
    <div class="app-header-container">
        <div class="header-left">
            <el-button class="collapse-icon" type="text" @click="setCollapse">
                <i class="fal fa-arrow-to-left" :style="collapseIconStyle"></i>
            </el-button>
        </div>

        <div class="header-right"></div>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex';

    export default {
        name: 'AppHeader',
        methods: {
            ...mapMutations(['setCollapse'])
        },
        computed: {
            ...mapState(['collapse']),
            collapseIconStyle() {
                return {
                    transform: this.collapse ? 'rotate(180deg)' : ''
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .app-header-container {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-left {
            .collapse-icon {
                font-size: 24px;

                i {
                    transition: all 0.3s;
                }
            }
        }

        .header-right {

        }
    }
</style>