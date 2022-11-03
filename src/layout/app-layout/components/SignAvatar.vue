<template>
  <!--已登录-->
  <el-popover
    v-if="Object.keys(userInfo).length"
    ref="avatarPopover"
    trigger="hover"
    placement="bottom"
    :width="300"
    @before-enter="popoverShow = true"
    @after-leave="popoverShow = false"
  >
    <template #reference>
      <div class="avatar-content">
        <el-avatar
          class="user-avatar"
          :style="userAvatarStyle"
          :src="avatarSrc"
          @click="toAccountHome"
        >
          {{ userInfo.nickname?.slice(0, 2) }}
        </el-avatar>
      </div>
    </template>
    <div class="avatar-popover-content">
      <p class="nickname">{{ userInfo.nickname }}</p>
      <MemberTag @get-data="toAccountBuy" />
      <div class="menu-list">
        <div class="menu-item" @click="toAccountHome">
          <i class="fa-duotone fa-user fa-fw" />
          <span>个人中心</span>
          <i class="fa-duotone fa-angle-right" />
        </div>
        <div class="menu-item" @click="toAccountOrder">
          <i class="fa-duotone fa-rectangle-list fa-fw" />
          <span>我的订单</span>
          <i class="fa-duotone fa-angle-right" />
        </div>
        <div class="menu-item" @click="toMyCards">
          <i class="fa-duotone fa-cards-blank fa-fw" />
          <span>我的卡片</span>
          <i class="fa-duotone fa-angle-right" />
        </div>
        <el-divider />
        <div class="menu-item" @click="logout">
          <i class="fa-duotone fa-arrow-right-from-bracket fa-fw" />
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
      <p>成为会员后你可以：</p>
      <el-row :gutter="gutter">
        <el-col :span="12">
          <p>
            <i class="fa-solid fa-gauge-max fa-fw" />
            全站资源加速
          </p>
        </el-col>
        <el-col :span="12">
          <p>
            <i class="fa-solid fa-cards-blank fa-fw" />
            卡片批量导出
          </p>
        </el-col>
        <el-col :span="12">
          <p>
            <i class="fa-solid fa-cloud-arrow-up fa-fw" />
            云端管理卡片
          </p>
        </el-col>
        <el-col :span="12">
          <p>
            <i class="fa-solid fa-message-image fa-fw" />
            卡片社区交流
          </p>
        </el-col>
      </el-row>
      <el-button
        style="width: 100%;"
        type="primary"
        size="large"
        @click="login"
      >
        戳此登录
      </el-button>
      <el-space :size="10">
        <el-button type="primary" text @click="register">立即注册</el-button>
        <el-button text @click="closeTip">不再提示</el-button>
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
      :validate-on-rule-change="false"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :maxlength="32" :placeholder="signTab === 'login' ? '请输入用户名或手机号' : '请输入用户名'" />
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
      <template v-if="signTab === 'login'">
        <div class="forgot-password">
          <el-button type="primary" link @click="forgotPassword">忘记密码</el-button>
        </div>
      </template>
      <template v-if="signTab === 'register'">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" :maxlength="16" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            type="tel"
            :maxlength="11"
            placeholder="请输入手机号"
          >
            <template #prepend>+86</template>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div style="display: flex;align-items: center;flex: 1">
            <el-input v-model="form.captcha" placeholder="请输入验证码" />
            <el-button
              style="margin-left: 10px;flex-shrink: 0"
              plain
              :loading="captchaLoading"
              @click="sendCaptcha"
            >
              {{ captchaLoading ? `剩余 ${captchaCountdown} 秒` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </template>
    </el-form>
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

  <ForgotPasswordDialog v-model="forgotPasswordDialog" />
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { maxDialogWidth } from '@/utils';
  import md5 from 'md5';
  import MemberTag from '@/components/MemberTag';
  import ForgotPasswordDialog from '@/layout/app-layout/components/ForgotPasswordDialog';
  import { phoneReg } from '@/utils/rules';

  export default {
    name: 'SignAvatar',
    components: {
      MemberTag,
      ForgotPasswordDialog,
    },
    data() {
      return {
        gutter: 20,
        signTab: 'login',
        loading: false,
        captchaLoading: false,
        captchaCountdown: 0,
        form: {
          username: '',
          nickname: '',
          password: '',
          phone: '',
          captcha: '',
        },
        popoverShow: false,
        signDialog: false,
        forgotPasswordDialog: false,
      };
    },
    mounted() {
      const loginTip = localStorage.getItem('loginTip');
      if (loginTip !== 'false') {
        setTimeout(() => {
          this.$refs.loginPopover?.$refs.tooltipRef.onOpen();
        });
      }
    },
    methods: {
      ...mapActions(['removeUserInfo']),
      maxDialogWidth,
      closeDialog() {
        this.$refs.form.resetFields();
        this.signDialog = false;
      },
      tabChange() {
        this.$refs.form.resetFields();
      },
      login() {
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
      closeTip() {
        localStorage.setItem('loginTip', 'false');
        this.$refs.loginPopover?.hide();
      },
      sendCaptcha() {
        this.$refs.form.validateField('phone', valid => {
          if (valid) {
            this.axios({
              method: 'get',
              url: '/validate-phone',
              params: {
                phone: this.form.phone,
              },
            }).then(() => {
              this.axios({
                method: 'post',
                url: '/captcha/send',
                data: {
                  phone: this.form.phone,
                },
              }).then(() => {
                this.$message.success('发送成功，验证码 5 分钟内有效');
                this.captchaCountdown = 60;
                this.captchaLoading = true;
                const timer = setInterval(() => {
                  if (this.captchaCountdown === 0) {
                    clearInterval(timer);
                    this.captchaLoading = false;
                  } else {
                    this.captchaCountdown--;
                  }
                }, 1000);
              });
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
      logout() {
        this.removeUserInfo().then(() => {
          location.reload();
        });
      },
      toAccountHome() {
        this.$router.push('/account/home');
        this.$refs.avatarPopover?.hide();
      },
      toAccountBuy() {
        this.$router.push('/account/buy');
        this.$refs.avatarPopover?.hide();
      },
      toAccountOrder() {
        this.$router.push('/account/order');
        this.$refs.avatarPopover?.hide();
      },
      toMyCards() {
        this.$router.push('/my-cards');
        this.$refs.avatarPopover?.hide();
      },
      forgotPassword() {
        this.closeDialog();
        this.forgotPasswordDialog = true;
      },
    },
    computed: {
      ...mapState(['userInfo', 'bodyOffsetWidth', 'isAdmin', 'isMember', 'staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
      avatarSrc() {
        if (this.userInfo.avatar) {
          return `${this.baseImage}/${this.userInfo.avatar}`;
        }
        return '';
      },
      rules() {
        return {
          username: [{ required: true, message: this.signTab === 'login' ? '请输入用户名或手机号' : '请输入用户名', trigger: 'blur' }],
          nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '至少 6 位', trigger: ['blur', 'change'] },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: phoneReg, message: '请输入正确的手机号', trigger: ['blur', 'change'] },
          ],
          captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
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
      font-weight: bold;
      color: var(--main-color);
    }

    .member-tag {
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

      i {
        margin-right: 5px;
        color: var(--primary-color);
      }
    }

    .el-space {
      margin-top: 10px;
      width: 100%;
      justify-content: center;
    }
  }

  .forgot-password {
    display: flex;
    justify-content: flex-end;
  }
</style>
