import { createStore } from 'vuex';
import md5 from 'md5';
import { ElNotification } from 'element-plus';
import axios from 'axios';

export default createStore({
  state: {
    bodyOffsetWidth: 0,
    leftCollapse: false,
    rightCollapse: false,
    mysteryMode: false,
    staticURL: '',
    userInfo: {},
  },
  mutations: {
    setBodyOffsetWidth(state) {
      state.bodyOffsetWidth = document.body.offsetWidth;
    },
    setLeftCollapse(state, value) {
      state.leftCollapse = value;
    },
    setRightCollapse(state, value) {
      state.rightCollapse = value;
    },
    setStaticURL(state) {
      const mysteryCode = localStorage.getItem('mystery-code') || '';
      state.mysteryMode = md5(mysteryCode) === '21232f297a57a5a743894a0e4a801fc3';
      const prefix = state.mysteryMode ? '' : 'v-';
      if (!prefix) {
        setTimeout(() => {
          ElNotification.success({
            title: '已进入神秘模式',
            position: 'bottom-right',
          });
        }, 1000);
      }
      state.staticURL = `https://${prefix}static.kooriookami.top`;
    },
    setUserInfo(state) {
      try {
        state.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
      } catch (e) {
        state.userInfo = {};
      }
    },
  },
  actions: {
    getUserInfo({ commit }) {
      return axios({
        method: 'get',
        url: '/profile',
      }).then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        commit('setUserInfo');
      });
    },
  },
});
