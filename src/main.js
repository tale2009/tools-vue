import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'normalize.css';
import '@/styles/main.scss';
import '@/router/router-hooks';
import httpService from './plugins/http-service';
import dayjs from 'dayjs';
import base from '@/plugins/base';
import { loadCSS } from '@/utils';
import ElImageExtend from '@/extends/el-image-extend';

const app = createApp(App);

app.config.globalProperties.dayjs = dayjs;

app.use(ElementPlus, {
  locale: zhCn,
});
app._context.components['ElImage'] = ElImageExtend;
app.use(httpService);
app.use(base);
app.use(router);
app.use(store);
app.mount('#app');

store.commit('setStaticURL');
const staticURL = store.state.staticURL;
loadCSS(`${staticURL}/font/fontawesome-pro-6.1.0/css/all.css`);
loadCSS(`${staticURL}/yugioh/font/ygo-font.css`);
loadCSS(`${staticURL}/rush-duel/font/rd-font.css`);

// 接口请求地址配置
if (process.env.NODE_ENV === 'production') {
  // 上线环境
  app.config.globalProperties.baseURL = 'https://tools.kooriookami.top/api';
} else {
  // 本地环境
  app.config.globalProperties.baseURL = 'https://tools.kooriookami.top/api';
}
