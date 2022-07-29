import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'app',
    component: () => import('../layout/app-layout/AppLayout.vue'),
    redirect: '/dot-word',
    children: [
      {
        path: 'dot-word',
        name: 'dotWord',
        component: () => import('../views/dot-word/DotWord.vue'),
        meta: {
          title: '点阵字生成器',
        },
      },
      {
        path: 'dot-image',
        name: 'dotImage',
        component: () => import('../views/dot-image/DotImage.vue'),
        meta: {
          title: '点阵图生成器',
        },
      },
      {
        path: 'paint-board',
        name: 'paintBoard',
        component: () => import('../views/paint-board/PaintBoard.vue'),
        meta: {
          title: '画图板',
        },
      },
      {
        path: 'pixel-art',
        name: 'pixelArt',
        component: () => import('../views/pixel-art/PixelArt.vue'),
        meta: {
          title: '像素画',
        },
      },
      {
        path: 'yugioh',
        name: 'yugioh',
        component: () => import('../views/yugioh/Yugioh.vue'),
        meta: {
          title: '游戏王卡片生成器',
        },
      },
      {
        path: 'rush-duel',
        name: 'rushDuel',
        component: () => import('../views/rush-duel/RushDuel.vue'),
        meta: {
          title: '游戏王超速决斗',
        },
      },
      {
        path: 'yugioh-back',
        name: 'yugiohBack',
        component: () => import('../views/yugioh-back/YugiohBack.vue'),
        meta: {
          title: '游戏王卡背',
        },
      },
      {
        path: 'field-center',
        name: 'fieldCenter',
        component: () => import('../views/field-center/FieldCenter.vue'),
        meta: {
          title: '游戏王场地中心卡',
        },
      },
    ],
  },
  {
    path: '/share',
    name: 'share',
    component: () => import('../layout/blank-layout/BlankLayout.vue'),
    children: [
      {
        path: 'yugioh',
        name: 'shareYugioh',
        component: () => import('../views/share/yugioh/Yugioh.vue'),
        meta: {
          title: '游戏王卡片分享',
        },
      },
      {
        path: 'rush-duel',
        name: 'shareRushDuel',
        component: () => import('../views/share/rush-duel/RushDuel.vue'),
        meta: {
          title: '游戏王超速决斗分享',
        },
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../layout/app-layout/AppLayout.vue'),
    redirect: '/account/home',
    meta: {
      auth: true,
    },
    children: [
      {
        path: 'home',
        name: 'accountHome',
        component: () => import('../views/account/home/Home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'order',
        name: 'accountOrder',
        component: () => import('../views/account/order/Order.vue'),
        meta: {
          title: '我的订单',
        },
      },
      {
        path: 'password',
        name: 'accountPassword',
        component: () => import('../views/account/password/Password.vue'),
        meta: {
          title: '修改密码',
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
