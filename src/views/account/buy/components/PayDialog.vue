<template>
  <el-dialog
    title="支付页"
    :model-value="modelValue"
    :width="maxDialogWidth(500)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="closeDialog"
  >
    <el-form label-width="auto">
      <el-form-item label="订单号" prop="orderNumber">
        <span>{{ data.orderNumber }}</span>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <span>{{ data.name }}</span>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <span>￥{{ data.price }}</span>
      </el-form-item>
      <el-form-item label="支付方式">
        <div class="pay-way-image">
          <el-image :src="payWayImage" fit="contain" />
        </div>
      </el-form-item>
      <el-form-item v-if="data.qrcode" label="付款码">
        <qrcode-vue :value="data.qrcode" :size="200" />
      </el-form-item>
      <el-form-item v-if="data.payurl" label="付款链接">
        <el-button type="primary" link @click="toPayUrl">点击跳转</el-button>
      </el-form-item>
      <p class="pay-tip">如果支付失效请换一种支付方式</p>
    </el-form>
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'PayDialog',
    props: ['modelValue', 'data', 'payWayList'],
    emits: ['update:modelValue'],
    components: {
      QrcodeVue,
    },
    data() {
      return {
        timer: '',
      };
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$emit('update:modelValue', false);
      },
      getPayStatus() {
        this.axios({
          method: 'get',
          url: '/pay/status',
          params: {
            orderNumber: this.data.orderNumber,
          },
        }).then(res => {
          const data = res.data;
          if (data.status === 'completed') {
            this.$message.success('支付成功');
            this.closeDialog();
            this.$router.push('/account/home');
          }
        });
      },
      toPayUrl() {
        if (this.data.payurl) {
          open(this.data.payurl);
        }
      },
    },
    computed: {
      payWayImage() {
        return this.formatList(this.data.payWay, this.payWayList, 'image', 'payWay');
      },
    },
    watch: {
      modelValue() {
        if (this.modelValue) {
          this.timer = setInterval(() => {
            this.getPayStatus();
          }, 1000);
        } else {
          clearInterval(this.timer);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
    }

    .pay-way-image {
      .el-image {
        height: 40px;
        width: 120px;
      }
    }

    .pay-tip {
      margin: 20px 0 0;
      color: var(--info-color);
      font-size: 12px;
    }
  }
</style>
