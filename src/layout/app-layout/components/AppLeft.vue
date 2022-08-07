<template>
  <div class="app-left-container">
    <el-row v-for="(group, index) in toolList" :key="index">
      <el-col :span="24">
        <h3 class="group-title" @click="clickTitle(group)">
          <span>{{ group.title }}</span>
          <i class="fa-solid fa-angle-right" :style="arrowStyle(group)" />
        </h3>
      </el-col>
      <el-collapse-transition>
        <el-row v-show="showGroup(group)">
          <el-col
            v-for="(item, index) in group.children"
            :key="index"
            :span="12"
          >
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
      </el-collapse-transition>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="poster-list">
          <el-image :src="poster1" @click="toPoster1" />
          <el-image :src="poster2" @click="toPoster2" />
          <el-image :src="poster3" @click="toPoster3" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import toolList from '@/assets/json/tool-list.json';
  import poster1 from '@/assets/image/poster1.jpg';
  import poster2 from '@/assets/image/poster2.jpg';
  import poster3 from '@/assets/image/poster3.jpg';

  export default {
    name: 'AppLeft',
    data() {
      return {
        toolList,
        poster1,
        poster2,
        poster3,
        activeTitle: '',
      };
    },
    created() {
      this.initActiveTitle();
    },
    methods: {
      toPath(item) {
        this.$router.push(item.path);
      },
      initActiveTitle() {
        const tool = toolList.find(group => group.children.find(tool => this.$route.path === tool.path));
        if (tool) {
          this.activeTitle = tool.title;
        }
      },
      clickTitle(item) {
        this.activeTitle = this.activeTitle === item.title ? '' : item.title;
      },
      arrowStyle(item) {
        const isActive = item.title === this.activeTitle;
        return {
          transform: isActive ? 'rotate(90deg)' : '',
        };
      },
      showGroup(item) {
        return item.title === this.activeTitle;
      },
      itemStyle(item) {
        const isRoute = this.$route.path === item.path;
        return {
          color: isRoute ? 'var(--primary-color)' : '',
        };
      },
      toPoster1() {
        gtag('event', '霜灷卡牌');
        open('https://item.taobao.com/item.htm?id=665501436781');
      },
      toPoster2() {
        gtag('event', 'Xirsx');
        open('https://space.bilibili.com/8202433');
      },
      toPoster3() {
        gtag('event', '铭振天下');
        open('https://item.taobao.com/item.htm?id=674640080866');
      },
    },
    watch: {
      $route() {
        this.initActiveTitle();
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;

          &:hover {
            background: whitesmoke;
          }

          i {
            transition: all 0.3s;
          }
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
          display: flex;
          flex-wrap: wrap;

          .el-image {
            margin-top: 10px;
            width: 100%;
            cursor: pointer;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
