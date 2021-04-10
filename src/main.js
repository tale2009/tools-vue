import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'normalize.css';
import '@/core/route-actived';
import axios from './core/axios';
import dayjs from 'dayjs';
import base from '@/plugins/base';
import yugiohPlugin from '@/plugins/yugioh-plugin';

const app = createApp(App);

app.config.globalProperties.axios = axios;
app.config.globalProperties.dayjs = dayjs;

app.use(ElementPlus, {locale});
app.use(base);
app.use(yugiohPlugin);
app.use(router);
app.use(store);
const vm = app.mount('#app');

// 接口请求地址配置
if (process.env.NODE_ENV === 'production') {
    // 上线环境
    app.config.globalProperties.baseURL = 'https://tools.kooriookami.top/api';
} else {
    // 本地环境
    // app.config.globalProperties.baseURL = 'http://localhost:7010/api';
    app.config.globalProperties.baseURL = 'https://tools.kooriookami.top/api';
}

export default vm;
