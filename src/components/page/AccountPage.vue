<template>
  <div class="account-page-container">
    <div class="account-menu">
      <el-scrollbar>
        <div class="menu-header">
          <span v-if="!accountCollapse">个人中心</span>
          <el-button type="primary" link @click="setAccountCollapse(!accountCollapse)">{{ accountCollapse ? '展开' : '折叠' }}</el-button>
        </div>
        <el-menu :collapse="accountCollapse" :default-active="$route.path" router>
          <el-menu-item index="/account/home">
            <i class="fa-duotone fa-house fa-fw" />
            <template #title>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/account/info">
            <i class="fa-duotone fa-user fa-fw" />
            <template #title>
              <span>我的信息</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/account/buy">
            <i class="fa-duotone fa-user-crown fa-fw" />
            <template #title>
              <span>购买会员</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/account/order">
            <i class="fa-duotone fa-rectangle-list fa-fw" />
            <template #title>
              <span>我的订单</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/account/password">
            <i class="fa-duotone fa-lock-keyhole fa-fw" />
            <template #title>
              <span>修改密码</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>

    <div class="account-main">
      <el-scrollbar>
        <div class="account-slot">
          <slot />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'AccountPage',
    data() {
      return {};
    },
    methods: {
      ...mapMutations(['setAccountCollapse']),
    },
    computed: {
      ...mapState(['accountCollapse']),
    },
  };
</script>

<style lang="scss" scoped>
  .account-page-container {
    height: calc(100vh - 60px);
    overflow: hidden;
    display: flex;

    .account-menu {
      height: 100%;
      overflow: auto;
      flex-shrink: 0;
      border-right: 1px solid var(--border-color);

      .menu-header {
        height: 56px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 16px;
      }

      .el-menu {
        border: none;
        width: 200px;

        .el-menu-item {
          i {
            font-size: 18px;
            margin-right: 10px;
          }
        }

        &.el-menu--collapse {
          width: 64px;

          .el-menu-item {
            i {
              margin-right: 0;
            }
          }
        }
      }
    }

    .account-main {
      height: 100%;
      overflow: auto;
      flex-grow: 1;

      .account-slot {
        padding: 20px;
        width: fit-content;
      }
    }
  }
</style>
