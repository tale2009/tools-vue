import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import './style/main.scss';
import '@/core/route-actived';
import base from '@/plugins/base';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(base);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
