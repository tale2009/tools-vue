<template>
  <div v-loading="loading" class="order-container">
    <AccountPage>
      <SearchPage
        v-model:span="span"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @reset="reset"
        @search="search"
        @get-data="getOrderList"
      >
        <template #search>
          <el-form
            ref="form"
            :model="form"
            label-width="auto"
          >
            <el-row :gutter="gutter">
              <el-col :span="span">
                <el-form-item label="订单号" prop="orderNumber">
                  <el-input v-model="form.orderNumber" clearable placeholder="请输入订单号" />
                </el-form-item>
              </el-col>
              <el-col :span="span">
                <el-form-item label="支付方式" prop="payWay">
                  <el-select
                    v-model="form.payWay"
                    clearable
                    placeholder="请选择支付方式"
                  >
                    <el-option v-for="item in payWayList" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="span">
                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="form.status"
                    clearable
                    placeholder="请选择类型"
                  >
                    <el-option v-for="item in statusList" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="span">
                <el-form-item label="创建时间" prop="createDate">
                  <el-date-picker
                    v-model="form.createDate"
                    type="datetimerange"
                    value-format="x"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>

        <template #list>
          <el-table :data="orderList">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="80"
            />
            <el-table-column label="订单号" prop="orderNumber" min-width="180" />
            <el-table-column label="金额" prop="amount" min-width="80" />
            <el-table-column
              label="类型"
              prop="type"
              min-width="80"
              :formatter="typeFormatter"
            />
            <el-table-column
              label="支付方式"
              prop="payWay"
              min-width="100"
              :formatter="payWayFormatter"
            />
            <el-table-column label="状态" prop="status" min-width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.status === 'incomplete'">未完成</el-tag>
                <el-tag v-if="scope.row.status === 'completed'" type="success">已完成</el-tag>
                <el-tag v-if="scope.row.status === 'cancelled'" type="info">已取消</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="createDate"
              min-width="160"
              :formatter="timeFormatter"
            />
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <el-popconfirm v-if="scope.row.status === 'incomplete'" title="是否确认取消?" @confirm="cancelOrder(scope.row)">
                  <template #reference>
                    <el-button type="primary" link :loading="btnLoading">取消</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </SearchPage>
    </AccountPage>
  </div>
</template>

<script>
  import AccountPage from '@/components/page/AccountPage';
  import SearchPage from '@/components/page/SearchPage';

  export default {
    name: 'Order',
    components: {
      AccountPage,
      SearchPage,
    },
    data() {
      return {
        gutter: 20,
        span: 6,
        loading: false,
        btnLoading: false,
        form: {
          orderNumber: '',
          type: '',
          payWay: '',
          status: '',
          createDate: [],
        },
        currentPage: 1,
        pageSize: 20,
        total: 0,
        orderList: [],
        typeList: [
          { label: '月卡', value: 'monthly' },
          { label: '季卡', value: 'quarterly' },
          { label: '年卡', value: 'yearly' },
          { label: '永久', value: 'permanent' },
        ],
        payWayList: [
          { label: '支付宝', value: 'alipay' },
          { label: '微信支付', value: 'wxpay' },
        ],
        statusList: [
          { label: '未完成', value: 'incomplete' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
        ],
      };
    },
    created() {
      if (Number(localStorage.getItem('pageSize'))) {
        this.pageSize = Number(localStorage.getItem('pageSize'));
      }
      this.getOrderList();
    },
    methods: {
      getOrderList() {
        this.loading = true;
        this.axios({
          method: 'get',
          url: '/buy/list',
          params: {
            ...this.form,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          },
        }).then(res => {
          this.orderList = res.data;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
      },
      indexMethod(index) {
        return index + this.pageSize * (this.currentPage - 1) + 1;
      },
      typeFormatter(row) {
        return this.formatList(row.type, this.typeList);
      },
      payWayFormatter(row) {
        return this.formatList(row.payWay, this.payWayList);
      },
      cancelOrder(row) {
        this.btnLoading = true;
        this.axios({
          method: 'put',
          url: `/buy/cancel/${row.id}`,
        }).then(res => {
          this.$message.success('取消成功');
          this.getOrderList();
        }).finally(() => {
          this.btnLoading = false;
        });
      },
      search() {
        this.currentPage = 1;
        this.getOrderList();
      },
      reset() {
        this.$refs.form.resetFields();
        this.currentPage = 1;
        this.getOrderList();
      },
      sizeChange() {
        this.getOrderList();
      },
      currentChange() {
        this.getOrderList();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .order-container {

  }
</style>
