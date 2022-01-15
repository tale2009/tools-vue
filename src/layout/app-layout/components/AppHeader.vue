<template>
  <div class="app-header-container">
    <div class="header-left">
      <el-button class="collapse-icon" type="text" @click="setLeftCollapse(!leftCollapse)">
        <i class="fa-light fa-arrow-to-left" :style="leftCollapseIconStyle" />
      </el-button>
    </div>

    <div class="header-center">
      <el-button class="mystery-icon" type="text" @dblclick="openMysteryBox">
        <i class="fa-light fa-dog" />
      </el-button>
    </div>

    <div class="header-right">
      <el-space :size="10">
        <i class="fab fa-github" @click="toGithub" />
        <el-button type="text" @click="aboutDialog = true">关于 & 赞助</el-button>
        <el-button type="text" @click="thankDialog = true">感谢</el-button>
        <el-button class="collapse-icon" type="text" @click="toggleFullscreen">
          <i v-if="!isFullscreen" class="fa-light fa-expand" />
          <i v-else class="fa-light fa-compress" />
        </el-button>
        <el-button class="collapse-icon" type="text" @click="setRightCollapse(!rightCollapse)">
          <i class="fa-light fa-arrow-to-right" :style="rightCollapseIconStyle" />
        </el-button>
      </el-space>

      <AboutDialog v-model="aboutDialog" />
      <ThankDialog v-model="thankDialog" />
    </div>
  </div>
</template>

<script>
  import screenfull from 'screenfull';
  import AboutDialog from '@/components/dialog/AboutDialog';
  import ThankDialog from '@/components/dialog/ThankDialog';
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'AppHeader',
    components: {
      AboutDialog,
      ThankDialog,
    },
    data() {
      return {
        isFullscreen: false,
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
      openMysteryBox() {
        this.$messageBox.prompt('请输入神秘代码', '提示').then(({ value }) => {
          localStorage.setItem('mystery-code', value);
          location.reload();
        });
      },
    },
    computed: {
      ...mapState(['leftCollapse', 'rightCollapse']),
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

    .collapse-icon {
      font-size: 24px;

      i {
        transition: all 0.3s;
      }
    }

    .header-center {
      .mystery-icon {
        font-size: 24px;
        color: white;

        &:hover {
          color: whitesmoke;
        }
      }
    }

    .header-right {
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
