<template>
  <el-dialog
    title="批量导出图片"
    :model-value="modelValue"
    :width="maxDialogWidth(500)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div v-if="fontLoading" class="font-loading">
      <el-alert
        title="字体加载中..."
        effect="dark"
        center
        :closable="false"
      />
    </div>
    <el-form
      ref="form"
      :model="form"
      label-position="top"
    >
      <el-form-item label="请输入卡片密码（支持中英文逗号、空格、换行隔开）" prop="password">
        <el-input
          v-model="form.password"
          type="textarea"
          :autosize="{minRows: 6}"
          placeholder="请输入卡片密码"
        />
        <span>
          一次最多导出 100 张，当前
          <span :style="passwordNumberStyle">{{ passwordList.length }}</span>
          张
        </span>
      </el-form-item>
      <el-form-item v-if="btnLoading">
        <el-progress
          style="width: 100%"
          text-inside
          :stroke-width="18"
          :percentage="percentage"
        >
          <span>{{ currentIndex }} / {{ passwordList.length }}</span>
        </el-progress>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button
        type="primary"
        :disabled="exportDisabled"
        :loading="btnLoading"
        @click="batchExport"
      >
        批量导出
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { maxDialogWidth } from '@/utils';
  import { mapState } from 'vuex';

  export default {
    name: 'BatchExportDialog',
    props: ['modelValue', 'password', 'searchCardByPassword', 'exportImage'],
    emits: ['update:password'],
    data() {
      return {
        btnLoading: false,
        form: {
          password: '',
        },
        currentIndex: 0,
        timer: '',
        errorList: [],
      };
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$refs.form.resetFields();
        this.currentIndex = 0;
        clearInterval(this.timer);
        this.errorList = [];
        this.btnLoading = false;
        this.$emit('update:modelValue', false);
      },
      batchExport() {
        this.btnLoading = true;
        this.$emit('update:password', this.passwordList[this.currentIndex]);
        this.searchCardByPassword().then(() => {
          const imageList = document.querySelectorAll('img');
          this.timer = setInterval(() => {
            const flag = Array.from(imageList).every(item => item.complete) && !this.fontLoading;
            if (flag) {
              clearInterval(this.timer);
              setTimeout(() => {
                this.exportImage().finally(() => {
                  if (this.btnLoading) {
                    this.exportNext();
                  }
                });
              });
            }
          }, 100);
        }).catch(() => {
          this.errorList.push(this.passwordList[this.currentIndex]);
          this.exportNext();
        });
      },
      exportNext() {
        if (this.currentIndex < this.passwordList.length - 1) {
          this.currentIndex++;
          this.batchExport();
        } else {
          this.currentIndex = 0;
          this.btnLoading = false;
          const errorNumber = this.errorList.length;
          const successNumber = this.passwordList.length - errorNumber;
          let message = `<span>成功导出 ${successNumber} 张，失败 ${errorNumber} 张</span>`;
          if (this.errorList.length) {
            message += `<br><span>失败卡片密码：<br>${this.errorList.join('<br>')}</span>`;
          }
          this.$notify.success({
            title: '批量导出完成',
            message,
            dangerouslyUseHTMLString: true,
          });
          this.errorList = [];
        }
      },
    },
    computed: {
      ...mapState(['fontLoading']),
      exportDisabled() {
        return this.fontLoading || !this.passwordList.length || this.passwordList.length > 100;
      },
      passwordList() {
        return this.form.password.split(/,|，|\s|\n/).map(item => item.trim()).filter(item => item);
      },
      percentage() {
        return this.currentIndex / this.passwordList.length * 100;
      },
      passwordNumberStyle() {
        if (this.passwordList.length > 100) {
          return {
            color: 'var(--danger-color)',
          };
        }
        return {};
      },
    },
  };
</script>

<style lang="scss" scoped>
  .font-loading {
    margin-bottom: 20px;

    .el-alert {
      background: var(--primary-color);
    }
  }
</style>
