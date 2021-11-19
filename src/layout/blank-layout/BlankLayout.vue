<template>
  <div class="blank-layout-container">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
  export default {
    name: 'BlankLayout',
  };
</script>

<style lang="scss" scoped>
  .blank-layout-container {

  }
</style>
