import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import '@/core/route-actived';
import moment from 'moment';
import _ from 'lodash';
import base from '@/plugins/base';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(base);

Vue.prototype.moment = moment;
Vue.prototype._ = _;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
