import { createStore } from 'vuex';
import { ElNotification } from 'element-plus';
import axios from 'axios';
import { loadCSS } from '@/utils';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

export default createStore({
  state: {
    bodyOffsetWidth: 0,
    isSmallScreen: false,
    leftCollapse: false,
    rightCollapse: false,
    accountCollapse: false,
    staticURL: '',
    userInfo: {},
    isAdmin: false,
    isMember: false,
  },
  mutations: {
    setBodyOffsetWidth(state) {
      state.bodyOffsetWidth = document.body.offsetWidth;
      state.isSmallScreen = state.bodyOffsetWidth < 800;
    },
    setLeftCollapse(state, value) {
      state.leftCollapse = value;
    },
    setRightCollapse(state, value) {
      state.rightCollapse = value;
    },
    setAccountCollapse(state, value) {
      state.accountCollapse = value;
    },
    setStaticURL(state) {
      let prefix = 'v-';
      if (state.isAdmin || state.isMember) {
        prefix = '';
      }
      if (!prefix) {
        ElNotification.success({
          title: '已进入加速模式',
          position: 'bottom-right',
        });
      }
      state.staticURL = `https://${prefix}static.kooriookami.top`;
      loadCSS(`${state.staticURL}/font/fontawesome-pro-6.1.0/css/all.css`);
      loadCSS(`${state.staticURL}/yugioh/font/ygo-font.css`);
      loadCSS(`${state.staticURL}/rush-duel/font/rd-font.css`);
    },
    setUserInfo(state) {
      try {
        state.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
      } catch (e) {
        state.userInfo = {};
      }
      const role = state.userInfo.role;
      state.isAdmin = Array.isArray(role) && role.includes('admin');
      const member = state.userInfo.member;
      if (member) {
        const { type, expireDate } = member;
        if (type === 'permanent') {
          state.isMember = true;
        } else {
          state.isMember = dayjs().isBefore(expireDate);
        }
      }
    },
  },
  actions: {
    getUserInfo({ commit }) {
      return axios({
        method: 'get',
        url: '/profile',
      }).then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        commit('setUserInfo');
      });
    },
    removeUserInfo({ commit }) {
      return new Promise(resolve => {
        Cookies.remove('token');
        localStorage.removeItem('userInfo');
        commit('setUserInfo');
        resolve();
      });
    },
  },
});
