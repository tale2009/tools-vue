import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import '@/core/route-actived';
import dayjs from 'dayjs';
import _ from 'lodash';
import base from '@/plugins/base';
import VueClipboard from 'vue-clipboard2';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(base);
Vue.use(VueClipboard);

Vue.prototype.dayjs = dayjs;
Vue.prototype._ = _;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
