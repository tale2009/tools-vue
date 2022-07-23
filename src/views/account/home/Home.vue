<template>
  <div class="home-container">
    <AccountPage>
      <div>home</div>
    </AccountPage>
  </div>
</template>

<script>
  import AccountPage from '@/components/page/AccountPage';

  export default {
    name: 'Home',
    components: {
      AccountPage,
    },
  };
</script>

<style lang="scss" scoped>
  .home-container {

  }
</style>
