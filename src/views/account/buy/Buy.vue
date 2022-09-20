<template>
  <div class="buy-container">
    <AccountPage>
      <div v-if="buyConfig.enable" class="enabled-buy">
        <p class="title">购买会员</p>
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

        <p class="title">云端卡片扩容</p>
        <div class="capacity-notify">
          <el-alert
            title="云端卡片免费容量为 100 张 / 月，扩容后不支持降级。"
            type="info"
            show-icon
            :closable="false"
          />
        </div>
        <el-space class="capacity-list" :size="10" wrap>
          <template v-for="item in capacityList">
            <div
              v-if="item.capacity>=memberCapacity"
              class="capacity-item"
              :style="capacityItemStyle(item)"
              @click="clickCapacityItem(item)"
            >
              <p class="capacity">{{ item.capacity }} 张 / 月</p>
              <p class="price">{{ item.price }}</p>
            </div>
          </template>
        </el-space>

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
            price: '￥8',
            day: '30 天',
          },
        ],
        capacityList: [
          {
            capacity: 100,
            price: '￥0',
          },
          {
            capacity: 200,
            price: '￥2',
          },
          {
            capacity: 300,
            price: '￥4',
          },
          {
            capacity: 400,
            price: '￥6',
          },
          {
            capacity: 600,
            price: '￥10',
          },
          {
            capacity: 1100,
            price: '￥20',
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
    },
    computed: {
      ...mapState(['userInfo']),
      memberCapacity() {
        return this.userInfo.member?.capacity || 100;
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
