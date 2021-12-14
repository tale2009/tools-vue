<template>
  <div class="app-left-container">
    <el-row>
      <el-col v-for="(item,index) in toolList" :key="index" :span="12">
        <div class="item-main" :style="itemStyle(item)" @click="toPath(item)">
          <div class="item-icon">
            <i :class="`fal ${item.icon}`" />
          </div>
          <div class="item-title">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 自适应正方形 -->
    <ins
      class="adsbygoogle google-ad"
      data-ad-client="ca-pub-3947645219032140"
      data-ad-slot="8053647660"
      data-full-width-responsive="false"
    />
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
    mounted() {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
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
      }
    }
  }

  .google-ad {
    margin-top: 50px;
    display: block;
    height: 540px;
  }

  @media screen and (max-height: 900px) {
    .google-ad {
      height: 360px;
    }
  }

  @media screen and (max-height: 600px) {
    .google-ad {
      height: 180px;
    }
  }
</style>
