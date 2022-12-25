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
import ElImageExtend from '@/extends/el-image-extend';
import Cookies from 'js-cookie';

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

store.commit('setUserInfo');

if (Cookies.get('token')) {
  store.dispatch('getUserInfo').finally(() => {
    store.commit('setStaticURL');
  });
} else {
  store.dispatch('removeUserInfo').finally(() => {
    store.commit('setStaticURL');
  });
}

document.fonts.onloading = () => {
  store.commit('setFontLoading', true);
};
document.fonts.onloadingdone = () => {
  store.commit('setFontLoading', false);
};
document.fonts.onloadingerror = () => {
  store.commit('setFontLoading', false);
};

// 接口请求地址配置
if (process.env.NODE_ENV === 'production') {
  // 上线环境
  app.config.globalProperties.baseURL = 'http://172.16.0.8:8080/api';//https://tools.kooriookami.top/api
} else {
  // 本地环境
  app.config.globalProperties.baseURL = 'http://172.16.0.8:8080/api';
}

