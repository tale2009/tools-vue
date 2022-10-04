<template>
  <div v-loading="loading" class="cards-community-container">
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
                  <el-form-item label="作者" prop="nickname">
                    <el-input v-model="searchForm.nickname" clearable placeholder="请输入作者" />
                  </el-form-item>
                </el-col>
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
        <PageForm title="卡片社区" description="社区共享公开的卡片">
          <el-alert
            v-if="!isMember"
            style="margin-bottom: 20px"
            type="warning"
            show-icon
            :closable="false"
          >
            <template #title>
              <div style="display: flex; align-items: center">
                <span>会员可以保存卡片</span>
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
            <el-form-item label="作者">
              <span style="width: 100%">{{ form.user.nickname }}</span>
              <el-image
                v-if="authorAvatarSrc"
                class="user-avatar"
                :src="authorAvatarSrc"
                fit="cover"
                :preview-src-list="[authorAvatarSrc]"
                hide-on-click-modal
              />
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
                <el-col v-if="isAdmin || isMember" :span="24">
                  <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="copyCard"
                  >
                    保存为我的卡片
                  </el-button>
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
    name: 'CardsCommunity',
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
          nickname: '',
          name: '',
          type: '',
          scale: 0.1,
        },
        form: {
          name: '',
          type: '',
          user: {},
          createDate: '',
        },
        currentPage: 1,
        pageSize: 20,
        total: 0,
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
      if (Number(localStorage.getItem('searchScale'))) {
        this.searchForm.scale = Number(localStorage.getItem('searchScale'));
      }
      this.getCardList();
    },
    methods: {
      getCardList() {
        this.loading = true;
        this.axios({
          method: 'get',
          url: '/card/community/list',
          params: {
            ...this.searchForm,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          },
        }).then(res => {
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
        const { name, type, user, createDate } = item;
        this.currentCardId = item.id;
        this.form.name = name;
        this.form.type = type;
        this.form.user = user;
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
      async copyCard() {
        if (this.currentCardId) {
          this.btnLoading = true;
          await this.axios({
            method: 'post',
            url: '/card/copy',
            data: {
              cardId: this.currentCardId,
            },
          }).then(() => {
            this.$message.success('保存成功');
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
      ...mapState(['isAdmin', 'isMember', 'staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
      authorAvatarSrc() {
        if (this.form.user.avatar) {
          return `${this.baseImage}/${this.form.user.avatar}`;
        }
        return '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cards-community-container {
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
      .user-avatar {
        margin-top: 10px;
        height: 60px;
        width: 60px;
        border-radius: 50%;
        cursor: pointer;
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
    }
  }
</style>
