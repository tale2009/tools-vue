<template>
  <div class="password-container">
    <AccountPage>
      <div class="form-box">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="auto"
          :disabled="loading"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              :value="encryptPhone(userInfo.phone)"
              type="tel"
              placeholder="请输入手机号"
              disabled
            >
              <template #prepend>+86</template>
            </el-input>
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
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="loading"
              @click="confirm"
            >
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </AccountPage>
  </div>
</template>

<script>
  import AccountPage from '@/components/page/AccountPage';
  import { mapState } from 'vuex';
  import md5 from 'md5';
  import { encryptPhone } from '@/utils';

  export default {
    name: 'Password',
    components: {
      AccountPage,
    },
    data() {
      return {
        loading: false,
        captchaLoading: false,
        captchaCountdown: 0,
        form: {
          password: '',
          captcha: '',
        },
      };
    },
    methods: {
      encryptPhone,
      sendCaptcha() {
        this.$refs.form.validateField('phone', valid => {
          if (valid) {
            this.axios({
              method: 'post',
              url: '/captcha/send',
              data: {
                phone: this.userInfo.phone,
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
          }
        });
      },
      confirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            this.axios({
              method: 'put',
              url: '/profile/password',
              data: {
                ...this.form,
                password: md5(this.form.password),
              },
            }).then(res => {
              this.$message.success('操作成功');
              this.$refs.form.resetFields();
            }).finally(() => {
              this.loading = false;
            });
          }
        });
      },
    },
    computed: {
      ...mapState(['userInfo']),
      rules() {
        return {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '至少 6 位', trigger: ['blur', 'change'] },
          ],
          captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .password-container {
    .form-box {
      display: flex;
      justify-content: center;

      .el-form {
        max-width: 400px;
        flex-grow: 1;
      }
    }
  }
</style>
