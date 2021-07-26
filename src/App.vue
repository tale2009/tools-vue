<template>
    <el-config-provider :locale="locale">
        <router-view></router-view>
    </el-config-provider>
</template>

<script>
    import zhCn from 'element-plus/lib/locale/lang/zh-cn';

    export default {
        name: 'App',
        data() {
            return {
                locale: zhCn
            };
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
