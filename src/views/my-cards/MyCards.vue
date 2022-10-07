<template>
  <div v-loading="loading" class="my-cards-container">
    <Page>
      <template #default>
        <SearchPage
          v-model:span="span"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          @reset="reset"
          @search="search"
          @get-data="getCardList"
        >
          <template #search>
            <el-form
              ref="searchForm"
              :model="searchForm"
              label-width="auto"
            >
              <el-row :gutter="gutter">
                <el-col :span="span">
                  <el-form-item label="卡名" prop="name">
                    <el-input v-model="searchForm.name" clearable placeholder="请输入卡名" />
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="类型" prop="type">
                    <el-select
                      v-model="searchForm.type"
                      clearable
                      placeholder="请选择类型"
                    >
                      <el-option v-for="item in typeList" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="查看">
                    <el-radio-group v-model="searchForm.scale" @change="changeScale">
                      <el-radio-button :label="0.1">小</el-radio-button>
                      <el-radio-button :label="0.15">中等</el-radio-button>
                      <el-radio-button :label="0.2">大</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="数量">
                    <el-space :size="10">
                      <span>{{ cardNumber }} / {{ memberCapacity }}</span>
                      <el-button link type="primary" @click="toAccountBuy">扩容</el-button>
                    </el-space>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>

          <template #action>
            <el-radio-group v-model="mode" @change="changeMode">
              <el-radio-button label="single">单选</el-radio-button>
              <el-radio-button label="multiple">多选</el-radio-button>
            </el-radio-group>
          </template>

          <template #list>
            <div v-if="cardList.length" class="card-list">
              <div
                v-for="item in cardList"
                class="card-item"
                :style="cardItemStyle(item)"
                @click="clickCard(item)"
              >
                <YugiohCard v-if="item.type === 'yugioh'" :data="item.data" />
                <RushDuelCard v-if="item.type === 'rushDuel'" :data="item.data" />
              </div>
            </div>
            <el-empty v-else style="width: 100%" description="暂无卡片" />
          </template>
        </SearchPage>
      </template>

      <template #form>
        <PageForm title="我的卡片" description="在云端管理你的卡片">
          <el-alert
            v-if="!isMember"
            style="margin-bottom: 20px"
            type="warning"
            show-icon
            :closable="false"
          >
            <template #title>
              <div style="display: flex; align-items: center">
                <span>会员可以管理卡片</span>
                <el-button
                  style="margin-left: 10px"
                  type="primary"
                  link
                  size="small"
                  @click="toAccountBuy"
                >
                  购买会员
                </el-button>
              </div>
            </template>
          </el-alert>
          <!--单选模式-->
          <el-form v-if="mode === 'single' && selectCard.id" :model="form" label-width="auto">
            <el-form-item label="卡名">
              <span>{{ form.name }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ formatList(form.type, typeList) }}</span>
            </el-form-item>
            <el-form-item label="公开">
              <el-tooltip content="公开后所有用户都可见" placement="top">
                <el-switch v-model="form.display" :loading="btnLoading" @change="updateDisplay" />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="时间">
              <span>{{ formatTime(form.createDate) }}</span>
            </el-form-item>
            <div class="button-group">
              <el-row :gutter="gutter">
                <el-col :span="12">
                  <el-button plain @click="viewCard">查看卡片</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="success" @click="shareCard">分享卡片</el-button>
                </el-col>
                <el-col :span="24">
                  <el-button type="primary" :loading="btnLoading" @click="exportImage">导出图片</el-button>
                </el-col>
                <el-col :span="24">
                  <el-button type="primary" :loading="btnLoading" @click="editCard">编辑卡片</el-button>
                </el-col>
                <el-col :span="24">
                  <el-popconfirm title="是否确认删除？" @confirm="deleteCard">
                    <template #reference>
                      <el-button :loading="btnLoading" type="danger">删除卡片</el-button>
                    </template>
                  </el-popconfirm>
                </el-col>
              </el-row>
            </div>
            <CommentList :card-id="selectCard.id" />
          </el-form>
          <!--多选模式-->
          <div v-else-if="mode === 'multiple' && selectCardList.length">
            <p class="select-tip">当前已选择 {{ selectCardList.length }} 张</p>
            <div class="button-group">
              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="batchExportImage"
                  >
                    批量导出图片
                  </el-button>
                </el-col>
                <el-col :span="24">
                  <el-popconfirm title="是否确认批量删除？" @confirm="batchDeleteCard">
                    <template #reference>
                      <el-button :loading="btnLoading" type="danger">批量删除卡片</el-button>
                    </template>
                  </el-popconfirm>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-empty v-else description="请选择左侧卡片" />

          <CardDialog v-model="cardDialog" :card-id="selectCard.id" />
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/page/Page';
  import PageForm from '@/components/page/PageForm';
  import SearchPage from '@/components/page/SearchPage';
  import YugiohCard from '@/views/yugioh/components/YugiohCard';
  import RushDuelCard from '@/views/rush-duel/components/RushDuelCard';
  import CardDialog from '@/views/my-cards/components/CardDialog';
  import CommentList from '@/components/CommentList';
  import { mapMutations, mapState } from 'vuex';

  export default {
    name: 'MyCards',
    components: {
      Page,
      PageForm,
      SearchPage,
      YugiohCard,
      RushDuelCard,
      CardDialog,
      CommentList,
    },
    data() {
      return {
        gutter: 20,
        span: 6,
        loading: false,
        btnLoading: false,
        searchForm: {
          name: '',
          type: '',
          scale: 0.1,
        },
        form: {
          name: '',
          type: '',
          display: false,
        },
        currentPage: 1,
        pageSize: 20,
        total: 0,
        cardNumber: 0,
        cardList: [],
        typeList: [
          { label: '游戏王', value: 'yugioh' },
          { label: '超速决斗', value: 'rushDuel' },
        ],
        mode: 'single',
        selectCard: {},
        selectCardList: [],
        cardDialog: false,
      };
    },
    created() {
      if (Number(localStorage.getItem('pageSize'))) {
        this.pageSize = Number(localStorage.getItem('pageSize'));
      }
      if (Number(localStorage.getItem('searchScale'))) {
        this.searchForm.scale = Number(localStorage.getItem('searchScale'));
      }
      this.getCardList();
    },
    methods: {
      ...mapMutations(['setBatchExportCardList']),
      getCardNumber() {
        this.axios({
          method: 'get',
          url: '/card/number',
        }).then(res => {
          this.cardNumber = res.data.cardNumber;
        });
      },
      getCardList() {
        this.loading = true;
        this.axios({
          method: 'get',
          url: '/card/list',
          params: {
            ...this.searchForm,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          },
        }).then(res => {
          this.getCardNumber();
          this.cardList = res.data;
          this.total = res.total;
          this.cardList.forEach(item => {
            item.data.radius = true;
            if (item.image) {
              item.data.image = `${this.baseImage}/${item.image}`;
            }
            switch (item.type) {
              case 'yugioh':
                item.data.pendulumDescription = '';
                item.data.description = '';
                break;
              case 'rushDuel':
                item.data.description = '';
                break;
            }
          });
          this.changeScale();
        }).finally(() => {
          this.loading = false;
        });
      },
      search() {
        this.getCardList();
      },
      reset() {
        this.$refs.searchForm.resetFields();
        this.getCardList();
      },
      changeScale() {
        localStorage.setItem('searchScale', this.searchForm.scale);
        this.cardList.forEach(item => {
          item.data.scale = this.searchForm.scale;
        });
      },
      clickCard(item) {
        if (this.mode === 'single') {
          const { name, type, display, createDate } = item;
          this.selectCard = item;
          this.form.name = name;
          this.form.type = type;
          this.form.display = display;
          this.form.createDate = createDate;
        } else if (this.mode === 'multiple') {
          const card = this.selectCardList.find(value => value.id === item.id);
          if (card) {
            this.selectCardList = this.selectCardList.filter(value => value.id !== item.id);
          } else {
            this.selectCardList.push(item);
          }
        }
      },
      cardItemStyle(item) {
        if (this.mode === 'single') {
          return {
            borderColor: item.id === this.selectCard.id ? 'var(--primary-color)' : '',
            background: item.id === this.selectCard.id ? '#c6e2ff' : '',
          };
        } else if (this.mode === 'multiple') {
          const card = this.selectCardList.find(value => value.id === item.id);
          return {
            borderColor: card ? 'var(--primary-color)' : '',
            background: card ? '#c6e2ff' : '',
          };
        }
      },
      viewCard() {
        if (this.selectCard.id) {
          this.cardDialog = true;
        }
      },
      shareCard() {
        let path = '';
        if (this.selectCard.id) {
          switch (this.selectCard.type) {
            case 'yugioh':
              path = '/share/yugioh';
              break;
            case 'rushDuel':
              path = '/share/rush-duel';
              break;
          }
          const { href } = this.$router.resolve({
            path,
            query: {
              cardId: this.selectCard.id,
            },
          });
          open(href, '_blank');
        }
      },
      editCard() {
        if (this.selectCard.id) {
          let path = '';
          if (this.selectCard.id) {
            switch (this.selectCard.type) {
              case 'yugioh':
                path = '/yugioh';
                break;
              case 'rushDuel':
                path = '/rush-duel';
                break;
            }
          }
          this.$router.push({
            path,
            query: {
              cardId: this.selectCard.id,
            },
          });
        }
      },
      deleteCard() {
        if (this.selectCard.id) {
          this.btnLoading = true;
          this.axios({
            method: 'delete',
            url: '/card/' + this.selectCard.id,
          }).then(() => {
            this.$message.success('删除成功');
            this.selectCard = {};
            this.getCardList();
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      },
      exportImage() {
        if (this.selectCard.id) {
          this.setBatchExportCardList([this.selectCard]);
          let path = '';
          switch (this.selectCard.type) {
            case 'yugioh':
              path = '/yugioh';
              break;
            case 'rushDuel':
              path = '/rush-duel';
              break;
          }
          this.$router.push({
            path,
            query: {
              cardId: this.selectCard.id,
              batchExport: true,
            },
          });
        }
      },
      batchExportImage() {
        if (this.selectCardList.length) {
          const typeSet = new Set(this.selectCardList.map(value => value.type));
          if (typeSet.size > 1) {
            this.$message.warning('请选择相同类型的卡片');
            return;
          }
          this.setBatchExportCardList(this.selectCardList);
          let path = '';
          switch (this.selectCardList[0].type) {
            case 'yugioh':
              path = '/yugioh';
              break;
            case 'rushDuel':
              path = '/rush-duel';
              break;
          }
          this.$router.push({
            path,
            query: {
              cardId: this.selectCardList[0].id,
              batchExport: true,
            },
          });
        }
      },
      batchDeleteCard() {
        if (this.selectCardList.length) {
          this.btnLoading = true;
          this.axios({
            method: 'delete',
            url: '/card/' + this.selectCardList.map(value => value.id).join('|'),
          }).then(() => {
            this.$message.success('批量删除成功');
            this.selectCardList = [];
            this.getCardList();
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      },
      updateDisplay() {
        if (this.selectCard.id) {
          this.btnLoading = true;
          this.axios({
            method: 'put',
            url: '/card/display/' + this.selectCard.id,
            data: this.form,
          }).then(() => {
            this.$message.success('保存成功');
            this.getCardList();
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      },
      toAccountBuy() {
        this.$router.push('/account/buy');
      },
      changeMode() {
        this.selectCard = {};
        this.selectCardList = [];
      },
    },
    computed: {
      ...mapState(['userInfo', 'isAdmin', 'isMember', 'staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
      memberCapacity() {
        return this.userInfo.member?.capacity || 100;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-cards-container {
    .page-main {
      .card-list {
        display: flex;
        flex-wrap: wrap;

        .card-item {
          padding: 5px;
          border: 2px solid transparent;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            border-color: var(--placeholder-color);
            background: var(--border-color);
          }
        }
      }
    }

    .form-main {
      .select-tip {
        margin: 0 0 20px;
        color: var(--normal-color);
      }

      .button-group {
        .el-row {
          margin-top: -20px;

          .el-col {
            margin-top: 20px;

            ::v-deep(.el-upload) {
              width: 100%;
            }

            .el-button {
              width: 100%;
            }
          }
        }
      }

      .comment-list {
        margin-top: 20px;
      }
    }
  }
</style>
