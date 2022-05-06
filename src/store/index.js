import { createStore } from 'vuex';
import md5 from 'md5';
import { ElNotification } from 'element-plus';

export default createStore({
  state: {
    leftCollapse: false,
    rightCollapse: false,
    staticURL: '',
  },
  mutations: {
    setLeftCollapse(state, value) {
      state.leftCollapse = value;
    },
    setRightCollapse(state, value) {
      state.rightCollapse = value;
    },
    setStaticURL(state) {
      const mysteryCode = localStorage.getItem('mystery-code') || '';
      const prefix = md5(mysteryCode) === '21232f297a57a5a743894a0e4a801fc3' ? '' : 'v-';
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
  },
  actions: {},
});
