<template>
    <div class="app-header-container">
        <div class="header-left">
            <el-button class="collapse-icon" type="text" @click="setCollapse">
                <i class="fal fa-arrow-to-left" :style="collapseIconStyle"></i>
            </el-button>
        </div>

        <div class="header-right">
            <i class="fab fa-github" @click="toGithub"></i>
            <el-button style="margin-left: 10px" type="text" @click="aboutDialog = true">关于 & 赞助</el-button>
            <el-button style="margin-left: 10px" type="text" @click="thankDialog = true">感谢</el-button>

            <AboutDialog :aboutDialog.sync="aboutDialog"></AboutDialog>
            <ThankDialog :thankDialog.sync="thankDialog"></ThankDialog>
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
            ...mapMutations(['setCollapse']),
            toGithub() {
                open('https://github.com/kooriookami/tools-vue');
            }
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
            display: flex;
            align-items: center;

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
