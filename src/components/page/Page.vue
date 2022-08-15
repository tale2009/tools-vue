<template>
  <div class="page-container">
    <div class="page-main">
      <el-scrollbar>
        <div class="page-slot">
          <slot />
        </div>
      </el-scrollbar>
    </div>
    <div
      v-if="$slots.form"
      ref="pageForm"
      class="page-form"
      :style="formStyle"
    >
      <el-scrollbar>
        <slot name="form" />
      </el-scrollbar>

      <div
        v-if="!rightCollapse"
        ref="splitButton"
        class="split-button"
        @mouseenter="mouseenterSplit"
        @mouseleave="mouseleaveSplit"
        @mousedown="mousedownSplit"
        @touchstart="mousedownSplit"
      >
        <i class="fa-light fa-grip-lines-vertical" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { getClientXY } from '@/utils';

  export default {
    name: 'Page',
    data() {
      return {
        collapse: false,
        pageFormWidth: Number(localStorage.getItem('pageFormWidth')) || 400,
      };
    },
    methods: {
      mouseenterSplit() {
        const pageFormRef = this.$refs.pageForm;
        const splitButton = this.$refs.splitButton;
        pageFormRef.style.borderLeft = '1px solid var(--primary-color)';
        splitButton.style.color = 'var(--primary-color)';
        splitButton.style.border = '1px solid var(--primary-color)';
      },
      mouseleaveSplit() {
        const pageFormRef = this.$refs.pageForm;
        const splitButton = this.$refs.splitButton;
        if (!splitButton.classList.contains('active')) {
          pageFormRef.style.borderLeft = '';
          splitButton.style.color = '';
          splitButton.style.border = '';
        }
      },
      mousedownSplit(e) {
        e.preventDefault();
        const pageFormRef = this.$refs.pageForm;
        const splitButton = this.$refs.splitButton;
        pageFormRef.style.borderLeft = '1px solid var(--primary-color)';
        pageFormRef.style.transition = 'none';
        splitButton.classList.add('active');
        splitButton.style.color = 'var(--primary-color)';
        splitButton.style.border = '1px solid var(--primary-color)';
        const oldPageFormWidth = this.pageFormWidth;
        const mousedownClientX = getClientXY(e).clientX;

        const mousemoveSplit = e => {
          const mousemoveClientX = getClientXY(e).clientX;
          const width = oldPageFormWidth + mousedownClientX - mousemoveClientX;
          if (width <= 400) {
            this.pageFormWidth = 400;
          } else if (width >= 600) {
            this.pageFormWidth = 600;
          } else {
            this.pageFormWidth = width;
          }
        };

        const mouseupSplit = () => {
          pageFormRef.style.borderLeft = '';
          pageFormRef.style.transition = '';
          splitButton.classList.remove('active');
          splitButton.style.color = '';
          splitButton.style.border = '';
          localStorage.setItem('pageFormWidth', this.pageFormWidth);
          removeEventListener('mousemove', mousemoveSplit);
          removeEventListener('touchmove', mousemoveSplit);
          removeEventListener('mouseup', mouseupSplit);
          removeEventListener('touchend', mouseupSplit);
        };

        addEventListener('mousemove', mousemoveSplit);
        addEventListener('touchmove', mousemoveSplit);
        addEventListener('mouseup', mouseupSplit);
        addEventListener('touchend', mouseupSplit);
      },
    },
    computed: {
      ...mapState(['rightCollapse']),
      formStyle() {
        return {
          width: `${this.pageFormWidth}px`,
          marginRight: this.rightCollapse ? `-${this.pageFormWidth}px` : '0',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-container {
    height: calc(100vh - 60px);
    display: flex;
    overflow: hidden;

    .page-main {
      height: 100%;
      overflow: auto;
      flex-grow: 1;
      position: relative;

      .page-slot {
        padding: 20px;
      }
    }

    .page-form {
      height: 100%;
      flex-shrink: 0;
      border-left: 1px solid var(--border-color);
      transition: all 0.3s;
      position: relative;

      .split-button {
        position: absolute;
        width: 14px;
        height: 40px;
        background: whitesmoke;
        border: 1px solid var(--border-color);
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: ew-resize;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
      }
    }
  }
</style>
