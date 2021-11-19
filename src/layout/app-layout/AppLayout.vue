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
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import AppHeader from '@/layout/app-layout/components/AppHeader';
  import AppLeft from '@/layout/app-layout/components/AppLeft';
  import { mapState } from 'vuex';
  import mobile from 'is-mobile';

  export default {
    name: 'AppLayout',
    components: {
      AppHeader,
      AppLeft,
    },
    mounted() {
      document.onkeydown = this.disableKey;
      document.onkeypress = this.disableKey;
    },
    methods: {
      mobileTip() {
        if (mobile()) {
          this.$confirm('<p>若功能异常，请使用 PC Chrome 浏览器。</p>' +
            '<p>移动端异常问题不再回复，请谅解！</p>', '移动端提示', {
            type: 'warning',
            dangerouslyUseHTMLString: true,
          });
        }
      },
      // 屏蔽某些键
      disableKey(e) {
        if (e.key === 'Backspace' && !['text', 'textarea', 'password', 'number'].includes(e.target.type)) {
          return false;
        }
      },
    },
    computed: {
      ...mapState(['leftCollapse']),
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
      border-bottom: 1px solid $border-color;
    }

    .el-container {
      height: calc(100vh - 60px);

      .left-aside {
        border-right: 1px solid $border-color;
        transition: all 0.3s;
      }

      .el-main {
        padding: 0;
      }
    }
  }
</style>
