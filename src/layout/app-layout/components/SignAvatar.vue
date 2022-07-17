<template>
  <!--已登录-->
  <el-popover
    v-if="Object.keys(userInfo).length"
    trigger="hover"
    placement="bottom"
    :width="300"
    @before-enter="popoverShow = true"
    @after-leave="popoverShow = false"
  >
    <template #reference>
      <div class="avatar-content">
        <el-avatar class="user-avatar" :style="userAvatarStyle">{{ userInfo.nickname?.slice(0, 2) }}</el-avatar>
      </div>
    </template>
    <div class="avatar-popover-content">
      <p class="nickname">{{ userInfo.nickname }}</p>
      <el-space class="tag-list" :size="10" wrap>
        <el-tag v-if="isAdmin" effect="dark" size="small">管理员</el-tag>
        <el-tag
          effect="dark"
          size="small"
          color="darkorange"
          style="border-color: darkorange"
        >
          月卡会员
        </el-tag>
      </el-space>
      <div class="menu-list">
        <div class="menu-item" @click="toMySpace">
          <i class="fa-light fa-user fa-fw" />
          <span>我的空间</span>
          <i class="fa-light fa-angle-right" />
        </div>
        <div class="menu-item" @click="toMyOrder">
          <i class="fa-light fa-rectangle-list fa-fw" />
          <span>我的订单</span>
          <i class="fa-light fa-angle-right" />
        </div>
        <el-divider />
        <div class="menu-item" @click="logout">
          <i class="fa-light fa-arrow-right-from-bracket fa-fw" />
          <span>退出登录</span>
        </div>
      </div>
    </div>
  </el-popover>
  <!--未登录-->
  <el-popover
    v-else
    ref="loginPopover"
    trigger="hover"
    placement="bottom"
    :width="300"
  >
    <template #reference>
      <el-avatar class="login-avatar" @click="login">登录</el-avatar>
    </template>
    <div class="login-popover-content">
      <p>
        <i style="color: darkorange; margin-right: 5px" class="fa-solid fa-fire" />
        现已推出
        <span style="font-size: 18px;font-weight: bold;color: darkorange">5</span>
        元月卡，快来体验全站加速吧！
      </p>
      <el-button
        style="width: 100%;"
        type="primary"
        size="large"
        @click="login"
      >
        戳此登录
      </el-button>
      <el-space :size="10">
        <span>暂无账号？</span>
        <el-button type="primary" text @click="register">立即注册</el-button>
      </el-space>
    </div>
  </el-popover>

  <el-dialog
    v-model="signDialog"
    title="登录 & 注册"
    :width="maxDialogWidth(500)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="closeDialog"
  >
    <el-tabs v-model="signTab" stretch @tab-change="tabChange">
      <el-tab-pane label="登录" name="login" />
      <el-tab-pane label="注册" name="register" />
    </el-tabs>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="auto"
      :disabled="loading"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          show-password
          placeholder="请输入密码"
          @keydown.enter="confirm"
        />
      </el-form-item>
      <template v-if="signTab === 'register'">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" type="tel" placeholder="请输入手机号">
            <template #prepend>+86</template>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div style="display: flex;align-items: center;flex: 1">
            <el-input v-model="form.code" placeholder="请输入验证码" />
            <el-button
              style="margin-left: 10px;flex-shrink: 0"
              plain
              :loading="codeLoading"
              @click="sendCode"
            >
              {{ codeLoading ? `剩余 ${codeCountdown} 秒` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <slide-verify v-if="false" slider-text="向右滑动" @success="sliderSuccess" />
    <template #footer>
      <el-button
        type="primary"
        style="width: 100%"
        size="large"
        :loading="loading"
        @click="confirm"
      >
        {{ signTab === 'login' ? '登录' : '注册' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import SlideVerify from 'vue3-slide-verify';
  import 'vue3-slide-verify/dist/style.css';
  import { mapActions, mapState } from 'vuex';
  import { maxDialogWidth } from '@/utils';
  import md5 from 'md5';

  export default {
    name: 'SignAvatar',
    components: {
      SlideVerify,
    },
    data() {
      return {
        signTab: 'login',
        loading: false,
        codeLoading: false,
        codeCountdown: 0,
        form: {
          username: '',
          nickname: '',
          password: '',
          phone: '',
          code: '',
        },
        popoverShow: false,
        signDialog: false,
      };
    },
    mounted() {
      setTimeout(() => {
        this.$refs.loginPopover?.$refs.tooltipRef.onOpen();
      });
    },
    methods: {
      ...mapActions(['getUserInfo', 'removeUserInfo']),
      maxDialogWidth,
      closeDialog() {
        this.$refs.form.resetFields();
        this.signDialog = false;
      },
      tabChange() {
        this.$refs.form.resetFields();
      },
      async login() {
        this.signTab = 'login';
        this.signDialog = true;
        setTimeout(() => {
          this.$refs.loginPopover?.hide();
        });
      },
      register() {
        this.signTab = 'register';
        this.signDialog = true;
        setTimeout(() => {
          this.$refs.loginPopover?.hide();
        });
      },
      sendCode() {
        this.$refs.form.validateField('phone', valid => {
          if (valid) {
            this.axios({
              method: 'get',
              url: '/validate-phone',
              params: {
                phone: this.form.phone,
              },
            }).then(() => {
              this.codeCountdown = 60;
              this.codeLoading = true;
              const timer = setInterval(() => {
                if (this.codeCountdown === 0) {
                  clearInterval(timer);
                  this.codeLoading = false;
                } else {
                  this.codeCountdown--;
                }
              }, 1000);
            });
          }
        });
      },
      confirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            this.axios({
              method: 'post',
              url: this.signTab === 'login' ? '/login' : '/register',
              data: {
                ...this.form,
                password: md5(this.form.password),
              },
            }).then(res => {
              if (this.signTab === 'register') {
                this.$message.success('注册成功');
              }
              location.reload();
            }).finally(() => {
              this.loading = false;
            });
          }
        });
      },
      sliderSuccess() {
        setTimeout(() => {
          this.closeDialog();
        }, 1000);
      },
      logout() {
        this.removeUserInfo().then(() => {
          location.reload();
        });
      },
      toMySpace() {

      },
      toMyOrder() {

      },
    },
    computed: {
      ...mapState(['userInfo', 'bodyOffsetWidth', 'isAdmin']),
      dialogWidth() {
        const offsetWidth = this.bodyOffsetWidth;
        return offsetWidth > 540 ? 500 : offsetWidth - 40;
      },
      rules() {
        return {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '至少 6 位', trigger: ['blur', 'change'] },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] },
          ],
          code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        };
      },
      userAvatarStyle() {
        if (this.popoverShow) {
          return {
            transform: 'scale(2)',
            zIndex: 10000,
          };
        }
        return {};
      },
    },
  };
</script>

<style lang="scss" scoped>
  .el-avatar {
    user-select: none;
    cursor: pointer;
  }

  .avatar-content {
    position: relative;
    height: 40px;
    width: 80px;

    .user-avatar {
      position: absolute;
      top: 0;
      right: 0;
      transform-origin: 100% 0;
      transition: all 0.3s;
    }
  }

  .avatar-popover-content {
    .nickname {
      text-align: center;
      line-height: 1.7;
      margin: 20px 0 0;
      font-size: 18px;
    }

    .tag-list {
      margin-top: 5px;
      justify-content: center;
      width: 100%;
    }

    .menu-list {
      margin-top: 10px;

      .menu-item {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 10px;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;

        i {
          font-size: 18px;

          &:first-child {
            margin-right: 10px;
          }
        }

        span {
          flex: 1;
        }

        &:hover {
          background: whitesmoke;
        }
      }

      .el-divider {
        margin: 10px 0;
      }
    }
  }

  .login-avatar {
    background: var(--primary-color);
  }

  .login-popover-content {
    p {
      line-height: 1.7;
      margin: 0 0 10px;
    }

    .el-space {
      margin-top: 10px;
      width: 100%;
      justify-content: center;
    }
  }
</style>
