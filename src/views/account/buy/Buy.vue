<template>
  <div class="buy-container">
    <AccountPage>
      <div v-if="buyConfig.enable" class="enabled-buy">
        <p class="title">购买会员</p>
        <el-space class="buy-list" :size="10" wrap>
          <template v-for="item in buyList">
            <div
              v-if="item.type !== 'capacity' || (item.type === 'capacity' && isMember)"
              class="buy-item"
              :style="buyItemStyle(item)"
              @click="clickBuyItem(item)"
            >
              <p class="name" :class="{'capacity-name' : item.type === 'capacity'}">{{ item.name }}</p>
              <p v-if="item.type !== 'capacity'" class="price">￥{{ item.price }}</p>
              <p v-if="item.type !== 'capacity'" class="day">{{ item.day }} 天</p>
            </div>
          </template>
        </el-space>

        <p class="title">云端卡片扩容</p>
        <div class="capacity-notify">
          <el-alert
            title="云端卡片免费容量为 100 张 / 月，扩容费用为 0.02 元 / 张·月，扩容后不支持降级。"
            type="info"
            show-icon
            :closable="false"
          />
        </div>
        <el-space class="capacity-list" :size="10" wrap>
          <template v-for="item in capacityList">
            <div
              v-if="item.capacity >= memberCapacity"
              class="capacity-item"
              :style="capacityItemStyle(item)"
              @click="clickCapacityItem(item)"
            >
              <p class="capacity">{{ item.capacity }} 张 / 月</p>
              <p class="price">￥{{ item.price }}</p>
            </div>
          </template>
        </el-space>

        <p class="total-amount">
          <span class="label">总计：</span>
          <span class="value">￥{{ totalAmount }}</span>
          <el-button
            class="button"
            type="primary"
            link
            @click="toggleDetail"
          >
            {{ showDetail ? '收起明细' : '展开明细' }}
          </el-button>
        </p>
        <div v-if="showDetail" class="amount-detail">
          <p>会员费：￥{{ memberPrice }}</p>
          <p>旧扩容费：￥{{ oldCapacityPrice }}（根据剩余会员时长计算）</p>
          <p>新扩容费：￥{{ newCapacityPrice }}</p>
        </div>

        <p class="title">支付方式</p>
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
          <el-button type="primary" :loading="btnLoading" @click="scanPay">立即购买</el-button>
        </div>

        <div class="buy-article">
          <p class="title">赞助返利</p>
          <p class="content">
            如果你曾经赞助过，赞助费可以折算成相应时长的会员哦！
            <el-button type="primary" link @click="toBilibili">B 站私信</el-button>
            发送你的账号信息，以及当时赞助的付款信息即可。
          </p>

          <p class="title">会员权益</p>
          <p class="content">1. 全站资源加速，包含图片、字体等资源加载提速，平均提速 10 倍以上。</p>
          <p class="content">2. 卡片批量导出，包含游戏王卡片与超速决斗的批量导出图片功能。</p>
          <p class="content">3. 云端管理卡片，包含游戏王卡片与超速决斗的卡片云端保存与管理功能。</p>
          <p class="content">4. 卡片社区交流，可以公开自己的卡片以及查看他人公开的卡片。</p>
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
  import { mapState } from 'vuex';

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
          capacity: 100,
        },
        buyList: [
          {
            name: '月卡会员',
            type: 'monthly',
            price: 8,
            day: 30,
            month: 1,
          },
          {
            name: '季卡会员',
            type: 'quarterly',
            price: 24,
            day: 90,
            month: 3,
          },
          {
            name: '年卡会员',
            type: 'yearly',
            price: 96,
            day: 365,
            month: 12,
          },
          {
            name: '单扩容',
            type: 'capacity',
            price: 0,
            day: 0,
            month: 0,
          },
        ],
        capacityList: [
          {
            capacity: 100,
            price: 0,
          },
          {
            capacity: 200,
            price: 2,
          },
          {
            capacity: 300,
            price: 4,
          },
          {
            capacity: 400,
            price: 6,
          },
          {
            capacity: 600,
            price: 10,
          },
          {
            capacity: 1100,
            price: 20,
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
        showDetail: false,
        payDialog: false,
      };
    },
    created() {
      this.form.capacity = this.memberCapacity;
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
          borderColor: item.type === this.form.type ? 'var(--primary-color)' : '',
        };
      },
      clickPayWayItem(item) {
        this.form.payWay = item.payWay;
      },
      payWayItemStyle(item) {
        return {
          borderColor: item.payWay === this.form.payWay ? 'var(--primary-color)' : '',
        };
      },
      clickCapacityItem(item) {
        this.form.capacity = item.capacity;
      },
      capacityItemStyle(item) {
        return {
          borderColor: item.capacity === this.form.capacity ? 'var(--primary-color)' : '',
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
      toggleDetail() {
        this.showDetail = !this.showDetail;
      },
    },
    computed: {
      ...mapState(['userInfo', 'defaultCapacity', 'capacityPrice', 'isMember']),
      memberCapacity() {
        if (!this.userInfo.member) {
          return this.defaultCapacity;
        }
        const { capacity } = this.userInfo.member;
        return capacity || this.defaultCapacity;
      },
      memberDay() {
        if (!this.userInfo.member) {
          return 0;
        }
        const nowTimestamp = new Date().getTime();
        const { expireDate } = this.userInfo.member;
        if (expireDate < nowTimestamp) {
          return 0;
        } else {
          return Math.floor((expireDate - nowTimestamp) / 86400000);
        }
      },
      oldCapacityPrice() {
        const capacity = this.capacityList.find(item => item.capacity === this.form.capacity);
        if (capacity) {
          return Math.round((capacity.capacity - this.memberCapacity) * this.capacityPrice * this.memberDay / 30 * 100) / 100;
        }
        return 0;
      },
      newCapacityPrice() {
        const buy = this.buyList.find(item => item.type === this.form.type);
        const capacity = this.capacityList.find(item => item.capacity === this.form.capacity);
        if (buy && capacity) {
          return (capacity.capacity - this.defaultCapacity) * this.capacityPrice * buy.month;
        }
        return 0;
      },
      memberPrice() {
        const buy = this.buyList.find(item => item.type === this.form.type);
        if (buy) {
          return buy.price;
        }
        return 0;
      },
      totalAmount() {
        return this.memberPrice + this.oldCapacityPrice + this.newCapacityPrice;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .buy-container {
    .enabled-buy {
      .title {
        margin: 20px 0 0;
        font-size: 18px;
        font-weight: bold;
        color: var(--primary-color);

        &:first-child {
          margin-top: 0;
        }
      }

      .total-amount {
        margin: 20px 0 0;

        .label {
          font-size: 16px;
        }

        .value {
          font-size: 24px;
          font-weight: bold;
          color: var(--primary-color);
        }

        .button {
          margin-left: 10px;
        }
      }

      .amount-detail {
        margin-top: 10px;
        color: var(--normal-color);
      }

      .buy-list {
        margin-top: 10px;
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

          .capacity-name {
            font-size: 18px;
            font-weight: bold;
            color: var(--primary-color);
          }
        }
      }

      .capacity-notify {
        margin-top: 10px;
      }

      .capacity-list {
        margin-top: 10px;
        display: flex;

        .capacity-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          height: 100px;
          width: 100px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;

          .capacity {
            margin: 0;
            font-size: 14px;
          }

          .price {
            margin: 10px 0 0;
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
          }
        }
      }

      .pay-way-list {
        margin-top: 10px;
        display: flex;

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
      line-height: 1.7;
      white-space: pre-wrap;
    }
  }
</style>
