import axios from 'axios';
import qs from 'qs';
import { ElNotification } from 'element-plus';
import Cookies from 'js-cookie';
import store from '@/store';

export default {
  install(app, options) {
    // 请求拦截器
    axios.interceptors.request.use(config => {
      config.baseURL = app.config.globalProperties.baseURL;
      if (Cookies.get('token')) {
        config.headers['Authorization'] = Cookies.get('token');
      }
      if (config.method === 'get') {
        config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' });
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
    // 响应拦截器
    axios.interceptors.response.use(response => {
      const token = response.headers.token;
      if (token) {
        Cookies.set('token', token, { expires: 30 });
      }
      return response;
    }, error => {
      // 对响应错误做点什么
      let message = error.response?.data?.message ?? error.message;
      ElNotification.error({
        title: '错误',
        message: message,
      });
      if (error.response.status === 401) {
        Cookies.remove('token');
        localStorage.removeItem('userInfo');
        store.commit('setUserInfo');
      }
      return Promise.reject(error);
    });

    app.config.globalProperties.axios = axios;
  },
};
