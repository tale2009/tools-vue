<template>
  <el-dialog
    title="感谢"
    :model-value="modelValue"
    :width="maxDialogWidth(500)"
    :before-close="closeDialog"
  >
    <div class="thank-main">
      <p>😃以下为赞助列表，感谢大家的支持！😄（按时间排序）</p>
      <div class="thank-list notranslate">
        <el-scrollbar :max-height="300">
          <p v-for="(item, index) in thankList" class="thank-item">
            <span class="sort">{{ index + 1 }}.</span>
            <span class="name">{{ item.name }}（￥{{ item.money?.toFixed(2) }}）</span>
            <span class="time">{{ item.time }}</span>
          </p>
        </el-scrollbar>
      </div>
    </div>
    <template #footer>
      <span v-if="isAdmin" class="sum-money">￥{{ sumMoney }}</span>
      <el-button plain @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import thankList from '@/assets/json/thank-list.json';
  import { mapState } from 'vuex';
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'ThankDialog',
    props: ['modelValue'],
    data() {
      return {
        thankList: thankList,
      };
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$emit('update:modelValue', false);
      },
    },
    computed: {
      ...mapState(['isAdmin']),
      sumMoney() {
        return this.thankList.reduce((acc, current) => acc + current.money, 0).toFixed(2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .thank-main {
    margin: -10px 0;

    p {
      line-height: 1.7;
      margin: 10px 0;
    }

    .thank-list {
      .thank-item {
        display: flex;
        justify-content: space-between;

        .sort {
          margin-right: 10px;
          flex-shrink: 0;
        }

        .name {
          flex-grow: 1;
          margin-right: 10px;
        }

        .time {
          flex-shrink: 0;
        }
      }
    }
  }

  .sum-money {
    color: var(--normal-color);
    margin-right: 10px;
  }
</style>
