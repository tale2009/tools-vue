<template>
  <div class="app-left-container">
    <el-row v-for="(group, index) in toolList" :key="index">
      <el-col :span="24">
        <h3 class="group-title">{{ group.title }}</h3>
      </el-col>
      <el-col v-for="(item, index) in group.children" :key="index" :span="12">
        <div class="item-main" :style="itemStyle(item)" @click="toPath(item)">
          <div class="item-icon">
            <i :class="`fa-light ${item.icon}`" />
          </div>
          <div class="item-title">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="poster-list">
          <el-image :src="poster1" @click="toPoster1" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import toolList from '@/assets/json/tool-list.json';
  import poster1 from '@/assets/image/poster1.jpg';

  export default {
    name: 'AppLeft',
    data() {
      return {
        toolList: toolList,
        poster1: poster1,
      };
    },
    methods: {
      toPath(item) {
        this.$router.push(item.path);
      },
      itemStyle(item) {
        let isRoute = this.$route.path.includes(item.path);
        return {
          color: isRoute ? '#409eff' : '',
        };
      },
      toPoster1() {
        gtag('event', '霜灷卡牌');
        open('https://item.taobao.com/item.htm?id=665501436781');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-left-container {
    padding: 10px;

    .el-row {
      .el-col {
        .group-title {
          margin: 10px 0;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
        }

        .item-main {
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-size: 12px;
          cursor: pointer;

          .item-icon {
            font-size: 24px;
          }

          .item-title {
            margin-top: 10px;
          }

          &:hover {
            background: #ecf5ff;
          }
        }

        .poster-list {
          margin-top: 10px;

          .el-image {
            cursor: pointer;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
