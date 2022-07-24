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
        <el-dropdown v-if="isSmallScreen" class="menu-dropdown">
          <el-button
            class="menu-icon"
            type="primary"
            link
          >
            <i class="fa-light fa-bars" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toGithub">
                <i class="fa-brands fa-github fa-fw" />
                Github
              </el-dropdown-item>
              <el-dropdown-item @click="qADialog = true">
                <i class="fa-solid fa-square-q fa-fw" />
                Q & A
              </el-dropdown-item>
              <el-dropdown-item @click="aboutDialog = true">
                <i class="fa-solid fa-circle-dollar fa-fw" />
                关于 & 赞助
              </el-dropdown-item>
              <el-dropdown-item @click="thankDialog = true">
                <i class="fa-solid fa-money-check fa-fw" />
                感谢
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </div>

    <div class="header-right">
      <el-space :size="10">
        <SignAvatar v-if="test" />
        <template v-if="!isSmallScreen">
          <i class="fa-brands fa-github" @click="toGithub" />
          <el-button color="#626aef" size="small" @click="qADialog = true">Q & A</el-button>
          <el-button type="primary" link @click="aboutDialog = true">关于 & 赞助</el-button>
          <el-button type="primary" link @click="thankDialog = true">感谢</el-button>
        </template>
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

      <QADialog v-model="qADialog" />
      <AboutDialog v-model="aboutDialog" />
      <ThankDialog v-model="thankDialog" />
    </div>
  </div>
</template>

<script>
  import screenfull from 'screenfull';
  import SignAvatar from '@/layout/app-layout/components/SignAvatar';
  import QADialog from '@/components/dialog/QADialog';
  import AboutDialog from '@/components/dialog/AboutDialog';
  import ThankDialog from '@/components/dialog/ThankDialog';
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'AppHeader',
    components: {
      SignAvatar,
      QADialog,
      AboutDialog,
      ThankDialog,
    },
    data() {
      return {
        isFullscreen: false,
        qADialog: false,
        aboutDialog: false,
        thankDialog: false,
        test: false, // 测试
      };
    },
    created() {
      this.test = localStorage.getItem('test') === 'test';
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
      ...mapState(['leftCollapse', 'rightCollapse', 'bodyOffsetWidth']),
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
      isSmallScreen() {
        return this.bodyOffsetWidth < 500;
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
