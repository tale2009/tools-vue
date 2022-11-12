<template>
  <div class="app-header-container">
    <div class="header-left">
      <el-space :size="10">
        <el-button
          class="collapse-icon"
          type="primary"
          link
          @click="setLeftCollapse(!leftCollapse)"
        >
          <i class="fa-light fa-arrow-to-left" :style="leftCollapseIconStyle" />
        </el-button>
      </el-space>
    </div>

    <p style="color: red">网站将于2022-12-25永久关闭，请相互通知</p>

    <div class="header-right">
      <el-space :size="10">
        <SignAvatar />
        <el-button
          class="collapse-icon"
          type="primary"
          link
          @click="toggleFullscreen"
        >
          <i v-if="!isFullscreen" class="fa-light fa-expand" />
          <i v-else class="fa-light fa-compress" />
        </el-button>
        <el-button
          class="collapse-icon"
          type="primary"
          link
          @click="setRightCollapse(!rightCollapse)"
        >
          <i class="fa-light fa-arrow-to-right" :style="rightCollapseIconStyle" />
        </el-button>
      </el-space>
    </div>
  </div>
</template>

<script>
  import screenfull from 'screenfull';
  import SignAvatar from '@/layout/app-layout/components/SignAvatar';
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'AppHeader',
    components: {
      SignAvatar,
    },
    data() {
      return {
        isFullscreen: false,
        qADialog: false,
        aboutDialog: false,
        thankDialog: false,
      };
    },
    mounted() {
      this.updateIsFullscreen();
      addEventListener('keydown', this.registerShortcut);
      screenfull.on('change', this.updateIsFullscreen);
    },
    beforeUnmount() {
      removeEventListener('keydown', this.registerShortcut);
      screenfull.off('change', this.updateIsFullscreen);
    },
    methods: {
      ...mapMutations(['setLeftCollapse', 'setRightCollapse']),
      toGithub() {
        open('https://github.com/kooriookami/tools-vue');
      },
      registerShortcut(e) {
        const { key } = e;
        if (key === 'F11') {
          this.toggleFullscreen();
          e.preventDefault();
        }
      },
      updateIsFullscreen() {
        this.isFullscreen = screenfull.isFullscreen;
      },
      toggleFullscreen() {
        if (screenfull.isEnabled) {
          screenfull.toggle();
        }
      },
    },
    computed: {
      ...mapState(['leftCollapse', 'rightCollapse', 'bodyOffsetWidth', 'isSmallScreen']),
      leftCollapseIconStyle() {
        return {
          transform: this.leftCollapse ? 'rotate(180deg)' : '',
        };
      },
      rightCollapseIconStyle() {
        return {
          transform: this.rightCollapse ? 'rotate(-180deg)' : '',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-header-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .collapse-icon, .menu-icon {
      font-size: 24px;
      height: auto;

      i {
        transition: all 0.3s;
      }
    }

    .header-right {
      i {
        font-size: 24px;
        cursor: pointer;

        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
</style>
