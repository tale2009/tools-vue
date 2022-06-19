<template>
  <div class="app-header-container">
    <div class="header-left">
      <el-button
        class="collapse-icon"
        type="primary"
        link
        @click="setLeftCollapse(!leftCollapse)"
      >
        <i class="fa-light fa-arrow-to-left" :style="leftCollapseIconStyle" />
      </el-button>
    </div>

    <div class="header-center">
      <el-button class="mystery-icon" link @dblclick="openMysteryBox">
        <i class="fa-light fa-dog" />
      </el-button>
    </div>

    <div class="header-right">
      <el-space :size="10">
        <i class="fab fa-github" @click="toGithub" />
        <el-button color="#626aef" size="small" @click="qADialog = true">Q & A</el-button>
        <el-popconfirm
          v-model:visible="showSponsorTip"
          title="点击这里可以赞助哦！"
          :icon="BellFilled"
          cancel-button-text="不再提示"
          confirm-button-text="知道啦"
          @cancel="cancelSponsorTip"
        >
          <template #reference>
            <el-button type="primary" link @click="aboutDialog = true">关于 & 赞助</el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" link @click="thankDialog = true">感谢</el-button>
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
  import QADialog from '@/components/dialog/QADialog';
  import AboutDialog from '@/components/dialog/AboutDialog';
  import ThankDialog from '@/components/dialog/ThankDialog';
  import { BellFilled } from '@element-plus/icons-vue';
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'AppHeader',
    components: {
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
        showSponsorTip: localStorage.getItem('showSponsorTip') !== 'false',
        BellFilled,
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
      cancelSponsorTip() {
        // 不再提示
        localStorage.setItem('showSponsorTip', 'false');
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
      height: auto;

      i {
        transition: all 0.3s;
      }
    }

    .header-center {
      .mystery-icon {
        font-size: 24px;
        color: transparent;

        &:hover {
          color: rgba(0, 0, 0, 0.1);
        }
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
