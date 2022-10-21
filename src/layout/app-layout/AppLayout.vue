<template>
  <div class="app-layout-container">
    <el-header>
      <AppHeader />
    </el-header>

    <el-container>
      <el-aside class="left-aside" width="200px" :style="leftStyle">
        <el-scrollbar>
          <AppLeft />
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view :key="$route.fullPath" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import AppHeader from '@/layout/app-layout/components/AppHeader';
  import AppLeft from '@/layout/app-layout/components/AppLeft';
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'AppLayout',
    components: {
      AppHeader,
      AppLeft,
    },
    data() {
      return {
        pingTimer: '',
      };
    },
    created() {
      this.browserTip();
      document.onkeydown = this.disableKey;
      document.onkeypress = this.disableKey;
      this.onResize();
      addEventListener('resize', this.onResize);
      this.sendPing();
      this.pingTimer = setInterval(() => {
        this.sendPing();
      }, 600 * 1000);
    },
    beforeUnmount() {
      removeEventListener('resize', this.onResize);
      clearInterval(this.pingTimer);
    },
    methods: {
      ...mapMutations(['setBodyOffsetWidth', 'setLeftCollapse', 'setAccountCollapse']),
      onResize() {
        this.setBodyOffsetWidth();
        if (this.isSmallScreen) {
          this.setLeftCollapse(true);
          this.setAccountCollapse(true);
        }
      },
      browserTip() {
        const isChrome = !!navigator.userAgent.match(/Chrome/i);
        const isFirefox = !!navigator.userAgent.match(/Firefox/i);
        if (isFirefox) {
          this.$notify.error({
            title: '检测到是 Firefox 浏览器',
            message: '此浏览器存在已知问题，请使用 Chrome 内核的浏览器',
          });
        } else if (!isChrome) {
          this.$notify.warning({
            title: '检测到不是 Chrome 浏览器',
            message: '如有功能异常，或者显示错位的情况，请使用 Chrome 内核的浏览器',
          });
        }
        if (devicePixelRatio !== 1) {
          this.$notify.warning({
            title: `当前浏览器缩放比为 ${Math.round(devicePixelRatio * 100)}%`,
            message: '推荐缩放比 100%，否则导出的图片尺寸会缩放',
          });
        }
      },
      // 屏蔽某些键
      disableKey(e) {
        if (e.key === 'Backspace' && !['input', 'textarea'].includes(e.target?.tagName.toLowerCase())) {
          return false;
        }
      },
      // 发送ping包
      sendPing() {
        this.axios({
          method: 'get',
          url: '/ping',
        });
      },
    },
    computed: {
      ...mapState(['leftCollapse', 'bodyOffsetWidth', 'isSmallScreen']),
      leftStyle() {
        return {
          marginLeft: this.leftCollapse ? '-200px' : '0',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-layout-container {
    .el-header {
      border-bottom: 1px solid var(--border-color);
    }

    .el-container {
      height: calc(100vh - 60px);

      .left-aside {
        border-right: 1px solid var(--border-color);
        transition: all 0.3s;
      }

      .el-main {
        padding: 0;
      }
    }
  }
</style>
