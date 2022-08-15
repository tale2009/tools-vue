<template>
  <div v-loading="loading" class="my-cards-container">
    <Page>
      <template #default>
        <div v-if="cardList.length" class="card-list">
          <div
            v-for="item in cardList"
            class="card-item"
            :style="cardItemStyle(item)"
            @click="clickCard(item)"
          >
            <YugiohCard :data="item.data" />
          </div>
        </div>
        <el-empty v-else style="width: 100%" description="暂无卡片" />
      </template>

      <template #form>
        <PageForm title="我的卡片" description="在这里管理你的云端卡片">
          <el-form v-if="Object.keys(currentData).length" :model="form" label-width="auto">
            <el-form-item label="卡名">
              <el-input v-model="form.name" />
            </el-form-item>
            <div class="button-group">
              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-button plain @click="viewCard">查看卡片</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="saveCard">保存修改</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="editCard">编辑卡片</el-button>
                </el-col>
                <el-col :span="24">
                  <el-popconfirm title="是否确认删除？" @confirm="deleteCard">
                    <template #reference>
                      <el-button type="danger">删除卡片</el-button>
                    </template>
                  </el-popconfirm>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <el-empty v-else description="请点击左侧卡片" />
          <CardDialog v-model="cardDialog" :card-id="currentData.id" />
        </PageForm>
      </template>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/page/Page';
  import YugiohCard from '@/views/yugioh/components/YugiohCard';
  import PageForm from '@/components/page/PageForm';
  import CardDialog from '@/views/my-cards/components/CardDialog';

  export default {
    name: 'MyCards',
    components: {
      Page,
      PageForm,
      YugiohCard,
      CardDialog,
    },
    data() {
      return {
        gutter: 20,
        loading: false,
        form: {
          name: '',
        },
        currentPage: 1,
        pageSize: 20,
        total: 0,
        cardList: [],
        currentData: {},
        cardDialog: false,
      };
    },
    created() {
      this.getCardList();
    },
    methods: {
      getCardList() {
        this.loading = true;
        this.axios({
          method: 'get',
          url: '/card/list',
        }).then(res => {
          this.cardList = res.data;
          this.cardList.forEach(item => {
            item.data.scale = 0.1;
            switch (item.type) {
            case 'yugioh':
              item.data.pendulumDescription = '';
              item.data.description = '';
              break;
            }
          });
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
      },
      clickCard(item) {
        const { name } = item;
        this.currentData = item;
        this.form.name = name;
      },
      cardItemStyle(item) {
        return {
          borderColor: item === this.currentData ? 'var(--primary-color)' : '',
          background: item === this.currentData ? '#c6e2ff' : '',
        };
      },
      viewCard() {
        if (Object.keys(this.currentData).length) {
          this.cardDialog = true;
        }
      },
      editCard() {
        if (Object.keys(this.currentData).length) {
          this.$router.push({
            path: '/yugioh',
            query: {
              cardId: this.currentData.id,
            },
          });
        }
      },
      saveCard() {
        if (Object.keys(this.currentData).length) {

        }
      },
      deleteCard() {
        if (Object.keys(this.currentData).length) {

        }
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
