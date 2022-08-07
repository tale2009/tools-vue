<template>
  <el-dialog
    title="一键注音"
    :model-value="modelValue"
    :width="maxDialogWidth(800)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      ref="form"
      :model="form"
      label-position="top"
    >
      <el-row :gutter="gutter">
        <el-col :span="span">
          <el-form-item label="注音只支持 OCG 常用语" prop="text">
            <el-input
              v-model="form.text"
              type="textarea"
              :autosize="{minRows: 6}"
              placeholder="请输入文本"
            />
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="常用注音表（点击可插入）" prop="filter">
            <el-input v-model="form.filter" clearable placeholder="请输入筛选文字" />
            <div class="kanji-kana-list notranslate">
              <el-scrollbar :max-height="400">
                <p v-for="(v,k) in filteredKanjiKanaMap" @click="insertKanjiKana(v)">{{ k }}：{{ v }}</p>
              </el-scrollbar>
            </div>
            <el-empty v-if="!Object.keys(filteredKanjiKanaMap).length" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button plain @click="removeKana">移除注音</el-button>
      <el-button type="primary" @click="addKana">一键注音</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import kanjiKanaMap from '@/assets/json/kanji-kana.json';
  import { kanjiToKana, removeKanjiKana } from '@/views/yugioh/yugioh';
  import { mapState } from 'vuex';
  import { maxDialogWidth } from '@/utils';

  export default {
    name: 'KanjiKanaDialog',
    props: ['modelValue'],
    data() {
      return {
        gutter: 20,
        form: {
          text: '',
          filter: '',
        },
      };
    },
    methods: {
      maxDialogWidth,
      closeDialog() {
        this.$refs.form.resetFields();
        this.$emit('update:modelValue', false);
      },
      addKana() {
        this.form.text = kanjiToKana(this.form.text);
      },
      removeKana() {
        this.form.text = removeKanjiKana(this.form.text);
      },
      insertKanjiKana(value) {
        this.form.text += value;
      },
    },
    computed: {
      ...mapState(['bodyOffsetWidth']),
      span() {
        if (this.bodyOffsetWidth > 600) {
          return 12;
        }
        return 24;
      },
      filteredKanjiKanaMap() {
        const filter = this.form.filter.trim();
        if (filter) {
          const map = {};
          const list = Object.keys(kanjiKanaMap).filter(value => value.includes(filter));
          list.forEach(value => {
            map[value] = kanjiKanaMap[value];
          });
          return map;
        }
        return kanjiKanaMap;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .kanji-kana-list {
    width: 100%;
    font-size: 14px;

    p {
      line-height: 1.7;
      margin: 10px 0;
      cursor: pointer;

      &:hover {
        color: var(--primary-color);
      }
    }
  }
</style>
