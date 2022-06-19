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
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
