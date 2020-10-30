import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css';
import '@/core/route-actived';
import dayjs from 'dayjs';
import _ from 'lodash';
import base from '@/plugins/base';

const app = createApp(App);

app.config.globalProperties.dayjs = dayjs;
app.config.globalProperties._ = _;

app.use(ElementPlus);
app.use(base);
app.use(router);
app.use(store);
app.mount('#app');
