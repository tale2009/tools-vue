<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
    @import './style/main';

    * {
        box-sizing: border-box;
        word-break: break-word;
    }

    body {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        color: $main-color;
        font-size: 14px;
    }
</style>
