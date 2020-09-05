import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        current: {}  // 当前表单
    },
    mutations: {
        setCurrent(state, value) {
            state.current = value;
        }
    },
    actions: {}
});
