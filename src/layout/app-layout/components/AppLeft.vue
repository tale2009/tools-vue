<template>
  <div class="app-left-container">
    <el-row>
      <el-col v-for="(item,index) in toolList" :key="index" :span="12">
        <div class="item-main" :style="itemStyle(item)" @click="toPath(item)">
          <div class="item-icon">
            <i :class="`fa-light ${item.icon}`" />
          </div>
          <div class="item-title">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="24" v-if="false">
        <div class="ad-rent">
          <el-tooltip content="微信号：kooriookami" placement="top">
            <span>广告位招租</span>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import toolList from '@/assets/json/tool-list.json';

  export default {
    name: 'AppLeft',
    data() {
      return {
        toolList: toolList,
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
    },
  };
</script>

<style lang="scss" scoped>
  .app-left-container {
    padding: 10px;

    .el-row {
      .el-col {
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

        .ad-rent {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90px;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          background-image: linear-gradient(135deg, #40efff, #4059ff);
        }
      }
    }
  }
</style>
