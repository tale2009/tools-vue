<template>
    <div class="app-header-container">
        <div class="header-left">
            <el-button class="collapse-icon" type="text" @click="setLeftCollapse(!leftCollapse)">
                <i class="fal fa-arrow-to-left" :style="leftCollapseIconStyle"></i>
            </el-button>
        </div>

        <div class="header-right">
            <el-space :size="10">
                <i class="fab fa-github" @click="toGithub"></i>
                <el-button type="text" @click="aboutDialog = true">关于 & 赞助</el-button>
                <el-button type="text" @click="thankDialog = true">感谢</el-button>
                <el-button class="collapse-icon" type="text" @click="setRightCollapse(!rightCollapse)">
                    <i class="fal fa-arrow-to-right" :style="rightCollapseIconStyle"></i>
                </el-button>
            </el-space>

            <AboutDialog v-model="aboutDialog"></AboutDialog>
            <ThankDialog v-model="thankDialog"></ThankDialog>
        </div>
    </div>
</template>

<script>
    import AboutDialog from '@/components/dialog/AboutDialog';
    import ThankDialog from '@/components/dialog/ThankDialog';
    import {mapMutations, mapState} from 'vuex';

    export default {
        name: 'AppHeader',
        components: {
            AboutDialog,
            ThankDialog
        },
        data() {
            return {
                aboutDialog: false,
                thankDialog: false
            };
        },
        methods: {
            ...mapMutations(['setLeftCollapse', 'setRightCollapse']),
            toGithub() {
                open('https://github.com/kooriookami/tools-vue');
            }
        },
        computed: {
            ...mapState(['leftCollapse', 'rightCollapse']),
            leftCollapseIconStyle() {
                return {
                    transform: this.leftCollapse ? 'rotate(180deg)' : ''
                };
            },
            rightCollapseIconStyle() {
                return {
                    transform: this.rightCollapse ? 'rotate(-180deg)' : ''
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

        .collapse-icon {
            font-size: 24px;

            i {
                transition: all 0.3s;
            }
        }

        .header-right {
            i {
                font-size: 24px;
                cursor: pointer;

                &:hover {
                    color: $primary-color
                }
            }
        }
    }
</style>
