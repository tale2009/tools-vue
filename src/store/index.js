import { createStore } from 'vuex';
import md5 from 'md5';
import { ElNotification } from 'element-plus';

export default createStore({
    state: {
        devicePixelRatio: 1,    // 设备缩放比率
        leftCollapse: false,
        rightCollapse: false,
        staticURL: ''
    },
    mutations: {
        setDevicePixelRatio(state) {
            state.devicePixelRatio = devicePixelRatio;
        },
        setLeftCollapse(state, value) {
            state.leftCollapse = value;
        },
        setRightCollapse(state, value) {
            state.rightCollapse = value;
        },
        setStaticURL(state) {
            const mysteryCode = localStorage.getItem('mystery-code') || '';
            // 防君子不防小人
            const prefix = md5(mysteryCode) === '21232f297a57a5a743894a0e4a801fc3' ? '' : 'v-';
            if (!prefix) {
                setTimeout(() => {
                    ElNotification.success({
                        title: '已进入神秘模式'
                    });
                }, 1000);
            }
            state.staticURL = `https://${prefix}static.kooriookami.top`;
        }
    },
    actions: {}
});
