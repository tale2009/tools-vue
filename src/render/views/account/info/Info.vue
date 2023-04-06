<template>
  <div class="info-container">
    <AccountPage>
      <div class="form-box">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="auto"
          :disabled="loading"
        >
          <el-form-item label="ID" prop="id">
            <span>{{ userInfo.id }}</span>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <span>{{ userInfo.username }}</span>
          </el-form-item>
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
  import AccountPage from '@/render/components/page/AccountPage';
  import { mapActions, mapState } from 'vuex';
  import { phoneReg } from '@/render/utils/rules';

  export default {
    name: 'Info',
    components: {
      AccountPage,
    },
    data() {
      return {
        loading: false,
        form: {
          nickname: '',
          phone: '',
        },
      };
    },
    created() {
      this.getAccountInfo();
    },
    methods: {
      ...mapActions(['getUserInfo']),
      getAccountInfo() {
        this.loading = true;
        this.getUserInfo().then(() => {
          this.form.nickname = this.userInfo.nickname;
          this.form.phone = this.userInfo.phone;
        }).finally(() => {
          this.loading = false;
        });
      },
      confirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            this.axios({
              method: 'put',
              url: '/profile',
              data: this.form,
            }).then(res => {
              this.$message.success('操作成功');
              this.getAccountInfo();
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
          nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: phoneReg, message: '请输入正确的手机号', trigger: ['blur', 'change'] },
          ],
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .info-container {
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
