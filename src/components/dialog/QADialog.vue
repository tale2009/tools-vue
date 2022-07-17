<template>
  <el-dialog
    title="Q & A"
    :model-value="modelValue"
    :width="maxDialogWidth(500)"
    :before-close="closeDialog"
  >
    <div class="q-a-list">
      <el-scrollbar :max-height="400">
        <div class="q-a">
          <p class="q">如何使用这个网站？</p>
          <p class="a">
            可以参考
            <el-button type="primary" link @click="toCourse">B站文集</el-button>
            ，评论区回答也可以多留意。
          </p>
        </div>
        <div class="q-a">
          <p class="q">为什么有时候图片导出无反应？</p>
          <p class="a">
            网页在 PC 端 Chrome 与 Edge 浏览器测试通过，移动端浏览器可能因为系统设置或者兼容性问题导致导出失败。
          </p>
        </div>
        <div class="q-a">
          <p class="q">为什么有的图片加载失败？</p>
          <p class="a">
            部分图片调用了第三方网站资源，如游戏王卡片生成器。而三方网站部署在国外服务器，国内访问可能被拦截，需要用户手动挂
            <ruby>梯子
              <rt>VPN</rt>
            </ruby>
            。
          </p>
        </div>
        <div class="q-a">
          <p class="q">游戏王卡片数据、卡图什么时候更新？</p>
          <p class="a">数据与卡图是三方资源，本人不参与维护，不确定更新时间。一般来说，新卡发布后卡图会陆续更新，请耐心等待。</p>
        </div>
        <div class="q-a">
          <p class="q">为什么浏览器有时候访问不了？</p>
          <p class="a">网页更新后，浏览器存在旧资源缓存。可以使用 Ctrl + F5 强制刷新页面。</p>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'QADialog',
    props: ['modelValue'],
    methods: {
      maxDialogWidth,
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
  .q-a-list {
    margin: -10px 0;

    .q-a {
      margin-top: 20px;

      &:first-child {
        margin-top: 0;
      }

      p {
        line-height: 1.7;
        margin: 10px 0;

        .el-button {
          padding: 0;
          height: auto;
          border: none;
          line-height: 1.7;
          vertical-align: top;
        }
      }

      .q, .a {
        padding-left: 24px;
        position: relative;

        &:before {
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .q {
        font-weight: bold;

        &:before {
          content: 'Q：';
        }
      }

      .a {
        &:before {
          content: 'A：';
        }
      }
    }
  }
</style>
