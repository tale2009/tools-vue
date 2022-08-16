<template>
  <div class="search-page-container">
    <div
      v-if="$slots.search"
      ref="searchForm"
      class="search-form"
      :style="searchFormStyle"
    >
      <slot name="search" />

      <div class="search-button" :style="searchButtonStyle">
        <el-button
          plain
          :icon="RefreshLeft"
          @click="$emit('reset')"
        >
          重置
        </el-button>
        <el-button
          type="primary"
          :icon="Search"
          @click="$emit('search')"
        >
          搜索
        </el-button>
      </div>
    </div>

    <div v-if="$slots.action" class="action-button">
      <slot name="action" />
    </div>

    <slot />

    <div v-if="$slots.list" class="table-list">
      <slot name="list" />

      <el-pagination
        v-if="pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="isSmallScreen ? 5 : 7"
        background
        :layout="isSmallScreen ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
        :total="total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
  import { RefreshLeft, Search } from '@element-plus/icons-vue';
  import { markRaw } from 'vue';
  import { useResizeObserver } from '@vueuse/core';
  import { mapState } from 'vuex';

  export default {
    name: 'SearchPage',
    emits: ['reset', 'search', 'update:span', 'update:page-size', 'update:current-page', 'get-data'],
    props: {
      span: {
        type: Number,
        default: 6,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
      pageSize: {
        type: Number,
        default: 20,
      },
      total: {
        type: Number,
        default: 0,
      },
      pagination: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        RefreshLeft: markRaw(RefreshLeft),
        Search: markRaw(Search),
        isSmallForm: false,
      };
    },
    mounted() {
      useResizeObserver(this.$refs.searchForm, entries => {
        const entry = entries[0];
        const { width } = entry.contentRect;
        const formWidth = width - 172;
        this.isSmallForm = formWidth < 360;
        this.setSpan(formWidth);
      });
    },
    methods: {
      setSpan(formWidth) {
        if (formWidth > 360 * 4) {
          this.$emit('update:span', 6);
        } else if (formWidth > 360 * 3) {
          this.$emit('update:span', 8);
        } else if (formWidth > 360 * 2) {
          this.$emit('update:span', 12);
        } else {
          this.$emit('update:span', 24);
        }
      },
      sizeChange(size) {
        this.$emit('update:page-size', size);
        this.$emit('get-data');
      },
      currentChange(page) {
        this.$emit('update:current-page', page);
        this.$emit('get-data');
      },
    },
    computed: {
      ...mapState(['isSmallScreen']),
      searchFormStyle() {
        if (this.isSmallForm) {
          return {
            flexDirection: 'column',
          };
        }
        return {};
      },
      searchButtonStyle() {
        if (this.isSmallForm) {
          return {
            marginTop: '18px',
          };
        }
        return {};
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search-page-container {
    .search-form {
      display: flex;

      ::v-deep(.el-form) {
        flex: 1;
        margin-bottom: -18px;
      }

      .search-button {
        display: flex;
        margin-left: 20px;
        justify-content: flex-end;
      }
    }

    .action-button {
      margin-top: 20px;
    }

    .table-list {
      margin-top: 20px;

      .el-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
</style>
