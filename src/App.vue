<template>
    <router-view></router-view>
</template>

<script>
    import mobile from 'is-mobile';

    export default {
        name: 'App',
        mounted() {
            this.mobileTip();
        },
        methods: {
            mobileTip() {
                if (mobile()) {
                    this.$confirm('<p>若功能异常，请使用 PC Chrome 浏览器。</p>' +
                        '<p>移动端异常问题不再回复，请谅解！</p>', '移动端提示', {
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    });
                }
            }
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
