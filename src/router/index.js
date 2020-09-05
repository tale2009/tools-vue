import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

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
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

export default router;
