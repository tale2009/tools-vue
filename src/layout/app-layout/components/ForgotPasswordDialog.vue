<template>
  <el-dialog
    title="忘记密码"
    :model-value="modelValue"
    :width="maxDialogWidth(500)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="closeDialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="auto"
      :disabled="loading"
    >
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
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        style="width: 100%"
        size="large"
        :loading="loading"
        @click="confirm"
      >
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { maxDialogWidth } from '@/utils';
  import md5 from 'md5';

  export default {
    name: 'ForgotPasswordDialog',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    data() {
      return {
        loading: false,
        captchaLoading: false,
        captchaCountdown: 0,
        form: {
          password: '',
          phone: '',
          captcha: '',
        },
      };
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$refs.form.resetFields();
        this.$emit('update:modelValue', false);
      },
      sendCaptcha() {
        this.$refs.form.validateField('phone', valid => {
          if (valid) {
            this.axios({
              method: 'get',
              url: '/exist-phone',
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
              method: 'put',
              url: '/reset-password',
              data: {
                ...this.form,
                password: md5(this.form.password),
              },
            }).then(res => {
              this.$message.success('操作成功，请重新登录');
              this.closeDialog();
            }).finally(() => {
              this.loading = false;
            });
          }
        });
      },
    },
    computed: {
      rules() {
        return {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '至少 6 位', trigger: ['blur', 'change'] },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] },
          ],
          captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        };
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
