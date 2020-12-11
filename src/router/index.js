import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'app',
        component: () => import(/* webpackChunkName: "app-layout" */ '../layout/app-layout/AppLayout.vue'),
        redirect: '/dot-word',
        children: [
            {
                path: 'dot-word',
                name: 'dotWord',
                component: () => import(/* webpackChunkName: "dotWord" */ '../views/dot-word/DotWord.vue'),
                meta: {
                    title: '点阵字生成器'
                }
            },
            {
                path: 'dot-image',
                name: 'dotImage',
                component: () => import(/* webpackChunkName: "dotImage" */ '../views/dot-image/DotImage.vue'),
                meta: {
                    title: '点阵图生成器'
                }
            },
            {
                path: 'yugioh',
                name: 'yugioh',
                component: () => import(/* webpackChunkName: "yugioh" */ '../views/yugioh/Yugioh.vue'),
                meta: {
                    title: '游戏王卡片生成器'
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
