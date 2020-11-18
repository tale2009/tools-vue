import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import '@/core/route-actived';
import axios from './core/axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import base from '@/plugins/base';
import yugiohPlugin from '@/plugins/yugioh-plugin';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(base);
Vue.use(yugiohPlugin);

Vue.prototype.axios = axios;
Vue.prototype.dayjs = dayjs;
Vue.prototype._ = _;

// 接口请求地址配置
if (process.env.NODE_ENV === 'production') {
    // 上线环境
    Vue.prototype.baseURL = 'https://tools.kooriookami.top/api';
} else {
    // 本地环境
    Vue.prototype.baseURL = 'http://localhost:7010/api/';
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
