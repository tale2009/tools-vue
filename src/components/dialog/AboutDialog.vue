<template>
  <el-dialog
    title="关于 & 赞助"
    :model-value="modelValue"
    width="500px"
    :before-close="closeDialog"
  >
    <div class="about-main">
      <p>🎉喜欢这个小工具，可以收藏并给个 star 哦。🎉</p>
      <p>如果你愿意，可以请我吃块巧克力🍫，喝杯咖啡☕，记得留下你的名字。</p>
      <p>
        欢迎赞助：
        <el-popover width="400" trigger="hover">
          <el-image :src="aliQr" />
          <template #reference>
            <el-link type="primary" :underline="false">支付宝</el-link>
          </template>
        </el-popover>
        <el-popover width="400" trigger="hover">
          <el-image :src="wxQr" />
          <template #reference>
            <el-link type="primary" :underline="false">微信</el-link>
          </template>
        </el-popover>
      </p>
      <p>
        使用教程：
        <el-link type="primary" :underline="false" @click="toCourse">B站文集</el-link>
      </p>
      <p>更新时间：{{ formatTime(config.updateTime) }}</p>
    </div>
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import aliQr from '@/assets/image/ali-qr.jpg';
  import wxQr from '@/assets/image/wx-qr.png';

  export default {
    name: 'AboutDialog',
    props: ['modelValue'],
    data() {
      return {
        aliQr: aliQr,
        wxQr: wxQr,
      };
    },
    methods: {
      closeDialog() {
        this.$emit('update:modelValue', false);
      },
      toCourse() {
        open('https://www.bilibili.com/read/readlist/rl314448');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .about-main {
    margin: -10px 0;

    p {
      line-height: 1.7;
      margin: 10px 0;

      .el-link {
        margin-right: 10px;
        vertical-align: top;
      }
    }
  }

  .el-popover {
    .el-image {
      vertical-align: top;
    }
  }
</style>
