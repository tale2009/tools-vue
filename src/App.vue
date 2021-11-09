<template>
    <router-view></router-view>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'App',
        mounted() {
            this.setDevicePixelRatio();
            addEventListener('resize', this.setDevicePixelRatio);
        },
        beforeUnmount() {
            removeEventListener('resize', this.setDevicePixelRatio);
        },
        methods: {
            ...mapMutations(['setDevicePixelRatio'])
        }
    };
</script>

<style lang="scss">
    @import 'styles/main';

    * {
        box-sizing: border-box;
        overflow-wrap: break-word;
        -webkit-tap-highlight-color: transparent;
    }

    body {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        color: $main-color;
        font-size: 14px;
    }
</style>
