<template>
  <el-space class="member-tag" :size="10" wrap>
    <el-tag v-if="isAdmin" effect="dark" size="small">管理员</el-tag>
    <template v-if="isMember">
      <el-tag
        v-if="userInfo.member?.type === 'monthly'"
        effect="dark"
        size="small"
        color="darkorange"
        style="border-color: darkorange"
      >
        月卡会员
      </el-tag>
      <el-tag
        v-else-if="userInfo.member?.type === 'quarterly'"
        effect="dark"
        size="small"
        color="darkorange"
        style="border-color: darkorange"
      >
        季卡会员
      </el-tag>
      <el-tag
        v-else-if="userInfo.member?.type === 'yearly'"
        effect="dark"
        size="small"
        color="orangered"
        style="border-color: orangered"
      >
        年卡会员
      </el-tag>
      <el-tag
        v-else-if="userInfo.member?.type === 'permanent'"
        effect="dark"
        size="small"
        color="orangered"
        style="border-color: orangered"
      >
        永久会员
      </el-tag>
    </template>
    <el-button
      v-else
      type="primary"
      link
      size="small"
      @click="toAccountBuy"
    >
      购买会员
    </el-button>
  </el-space>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'MemberTag',
    emits: ['get-data'],
    methods: {
      toAccountBuy() {
        this.$router.push('/account/buy');
        this.$emit('get-data');
      },
    },
    computed: {
      ...mapState(['userInfo', 'isAdmin', 'isMember']),
    },
  };
</script>

<style lang="scss" scoped>
  .member-tag {

  }
</style>
