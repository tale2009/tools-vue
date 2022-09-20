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
          <div
            v-for="item in posterList"
            class="poster-item"
            @click="toPoster(item)"
          >
            <div v-if="item.vip" class="vip-gradient" />
            <el-image :src="item.image" :style="posterStyle(item)" />
            <span v-if="item.vip" class="vip-tag">VIP</span>
          </div>
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
        activeTitle: '',
        posterList: [
          // {
          //   name: 'test',
          //   image: poster1,
          //   url: 'https://item.taobao.com/item.htm?id=665501436781',
          //   vip: true,
          // },
          {
            name: '霜灷卡牌',
            image: poster1,
            url: 'https://item.taobao.com/item.htm?id=665501436781',
            vip: false,
          },
          {
            name: '铭振天下',
            image: poster3,
            url: 'https://item.taobao.com/item.htm?id=674640080866',
            vip: false,
          },
          {
            name: '二毛游戏王',
            image: poster2,
            url: 'https://shop480578296.taobao.com',
            vip: false,
          },
        ],
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
      posterStyle(item) {
        return {
          border: item.vip ? '6px solid transparent' : '',
        };
      },
      toPoster(item) {
        gtag('event', item.name);
        open(item.url);
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
          .poster-item {
            display: flex;
            position: relative;
            margin-top: 10px;
            width: 100%;
            min-height: 89.5px;
            cursor: pointer;
            border-radius: 4px;
            overflow: hidden;

            .vip-gradient {
              position: absolute;
              height: 224%; // 根号5
              width: 112%;
              background-image: conic-gradient(#fd004c, #fe9000, #fff020, #3edf4b, #3363ff, #b102b7, #fd004c);
              top: -62%;
              left: -6%;
              animation: gradient-spin 3s infinite linear;
              z-index: 10;

              @keyframes gradient-spin {
                100% {
                  transform: rotate(360deg);
                }
              }
            }

            ::v-deep(.el-image) {
              position: relative;
              width: 100%;
              height: 100%;
              z-index: 20;
            }

            .vip-tag {
              position: absolute;
              top: 10px;
              left: 10px;
              color: white;
              background: orangered;
              border-radius: 4px;
              padding: 2px 4px;
              font-size: 12px;
              line-height: 1;
              z-index: 30;
            }
          }
        }
      }
    }
  }
</style>
