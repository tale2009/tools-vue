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
          <el-form v-if="currentCardId" :model="form" label-width="auto">
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
          </el-form>
          <el-empty v-else description="请选择左侧卡片" />

          <CardDialog v-model="cardDialog" :card-id="currentCardId" />
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
  import { mapState } from 'vuex';

  export default {
    name: 'MyCards',
    components: {
      Page,
      PageForm,
      SearchPage,
      YugiohCard,
      RushDuelCard,
      CardDialog,
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
        currentCardId: '',
        cardDialog: false,
      };
    },
    created() {
      if (Number(localStorage.getItem('pageSize'))) {
        this.pageSize = Number(localStorage.getItem('pageSize'));
      }
      this.getCardList();
    },
    methods: {
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
        this.cardList.forEach(item => {
          item.data.scale = this.searchForm.scale;
        });
      },
      clickCard(item) {
        const { name, type, display, createDate } = item;
        this.currentCardId = item.id;
        this.form.name = name;
        this.form.type = type;
        this.form.display = display;
        this.form.createDate = createDate;
      },
      cardItemStyle(item) {
        return {
          borderColor: item.id === this.currentCardId ? 'var(--primary-color)' : '',
          background: item.id === this.currentCardId ? '#c6e2ff' : '',
        };
      },
      viewCard() {
        if (this.currentCardId) {
          this.cardDialog = true;
        }
      },
      shareCard() {
        let path = '';
        const currentCard = this.cardList.find(item => item.id === this.currentCardId);
        if (currentCard) {
          if (currentCard) {
            switch (currentCard.type) {
              case 'yugioh':
                path = '/share/yugioh';
                break;
              case 'rushDuel':
                path = '/share/rush-duel';
                break;
            }
          }
          const { href } = this.$router.resolve({
            path,
            query: {
              cardId: this.currentCardId,
            },
          });
          open(href, '_blank');
        }
      },
      editCard() {
        if (this.currentCardId) {
          let path = '';
          const currentCard = this.cardList.find(item => item.id === this.currentCardId);
          if (currentCard) {
            switch (currentCard.type) {
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
              cardId: this.currentCardId,
            },
          });
        }
      },
      deleteCard() {
        if (this.currentCardId) {
          this.btnLoading = true;
          this.axios({
            method: 'delete',
            url: '/card/' + this.currentCardId,
          }).then(() => {
            this.$message.success('删除成功');
            this.currentCardId = '';
            this.getCardList();
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      },
      updateDisplay() {
        if (this.currentCardId) {
          this.btnLoading = true;
          this.axios({
            method: 'put',
            url: '/card/display/' + this.currentCardId,
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
    }
  }
</style>
