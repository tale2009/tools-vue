<template>
  <div class="buy-container">
    <AccountPage>
      <div v-if="buyConfig.enable" class="enabled-buy">
        <el-space class="buy-list" :size="10" wrap>
          <div
            v-for="item in buyList"
            class="buy-item"
            :style="buyItemStyle(item)"
            @click="clickBuyItem(item)"
          >
            <p class="name">{{ item.name }}</p>
            <p class="price">{{ item.price }}</p>
            <p class="day">{{ item.day }}</p>
          </div>
        </el-space>

        <el-space class="pay-way-list" :size="10" wrap>
          <div
            v-for="item in payWayList"
            class="pay-way-item"
            :style="payWayItemStyle(item)"
            @click="clickPayWayItem(item)"
          >
            <el-image :src="item.image" fit="contain" />
          </div>
        </el-space>

        <div class="buy-button">
          <el-button type="primary" :loading="btnLoading" @click="scanPay">扫码支付</el-button>
        </div>

        <div class="buy-article">
          <p class="title">赞助返利</p>
          <p class="content">
            如果你曾经赞助过，赞助费可以折算成相应时长的会员哦！
            <el-button type="primary" link @click="toBilibili">B 站私信</el-button>
            发送你的账号信息，以及当时赞助的付款信息即可。
          </p>

          <p class="title">会员权益</p>
          <p class="content">会员可享受全站加速，包含图片、字体等资源加载提速，平均提速 10 倍以上。</p>
        </div>

        <div class="buy-notify">
          <el-alert
            title="会员是虚拟商品，购买后不支持退款，请谨慎购买。"
            type="warning"
            show-icon
            :closable="false"
          />
        </div>
      </div>
      <div v-else class="disabled-buy">
        <span>{{ buyConfig.message }}</span>
      </div>

      <PayDialog v-model="payDialog" :data="payInfo" :pay-way-list="payWayList" />
    </AccountPage>
  </div>
</template>

<script>
  import AccountPage from '@/components/page/AccountPage';
  import PayDialog from '@/views/account/buy/components/PayDialog';
  import alipay from '@/assets/image/alipay.png';
  import wxpay from '@/assets/image/wxpay.png';

  export default {
    name: 'Buy',
    components: {
      AccountPage,
      PayDialog,
    },
    data() {
      return {
        btnLoading: false,
        form: {
          type: 'monthly',
          payWay: 'alipay',
        },
        buyList: [
          {
            name: '月卡会员',
            type: 'monthly',
            price: '￥8',
            day: '30 天',
          },
        ],
        payWayList: [
          {
            name: '支付宝',
            image: alipay,
            payWay: 'alipay',
          },
          {
            name: '微信支付',
            image: wxpay,
            payWay: 'wxpay',
          },
        ],
        buyConfig: {},
        payInfo: {},
        payDialog: false,
      };
    },
    created() {
      this.getBuyConfig();
    },
    methods: {
      getBuyConfig() {
        this.axios({
          method: 'get',
          url: '/buy/config',
        }).then(res => {
          this.buyConfig = res.data;
        });
      },
      clickBuyItem(item) {
        this.form.type = item.type;
      },
      buyItemStyle(item) {
        return {
          borderColor: item.type === this.form.type ? '#409EFF' : '',
        };
      },
      clickPayWayItem(item) {
        this.form.payWay = item.payWay;
      },
      payWayItemStyle(item) {
        return {
          borderColor: item.payWay === this.form.payWay ? '#409EFF' : '',
        };
      },
      scanPay() {
        this.btnLoading = true;
        this.axios({
          method: 'post',
          url: '/buy',
          data: this.form,
        }).then(res => {
          this.payInfo = res.data;
          this.payDialog = true;
        }).finally(() => {
          this.btnLoading = false;
        });
      },
      toBilibili() {
        open('https://space.bilibili.com/792063');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .buy-container {
    .enabled-buy {
      .buy-list {
        display: flex;

        .buy-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          height: 120px;
          width: 100px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
        }

        .name {
          margin: 0;
          font-size: 14px;
        }

        .price {
          margin: 10px 0 0;
          font-size: 24px;
          font-weight: bold;
          color: var(--primary-color);
        }

        .day {
          margin: 10px 0 0;
          font-size: 14px;
        }
      }

      .pay-way-list {
        margin-top: 20px;

        .pay-way-item {
          display: flex;
          padding: 10px;
          flex-shrink: 0;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;

          .el-image {
            height: 40px;
            width: 120px;
          }
        }
      }

      .buy-button {
        margin-top: 20px;
      }

      .buy-article {
        margin-top: 40px;

        .title {
          margin: 20px 0 0;
          font-size: 18px;
          font-weight: bold;
          color: var(--primary-color);
        }

        .content {
          margin: 10px 0 0;
          padding-left: 2em;
          line-height: 1.7;
          color: var(--normal-color);

          .el-button {
            padding: 0;
            height: auto;
            border: none;
            line-height: 1.7;
            vertical-align: top;
          }
        }
      }

      .buy-notify {
        margin-top: 20px;
      }
    }

    .disabled-buy {
      font-size: 14px;
      color: var(--danger-color);
    }
  }
</style>
