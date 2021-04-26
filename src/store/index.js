import {createStore} from 'vuex';

export default createStore({
    state: {
        leftCollapse: false,
        rightCollapse: false
    },
    mutations: {
        setLeftCollapse(state, value) {
            state.leftCollapse = value;
        },
        setRightCollapse(state, value) {
            state.rightCollapse = value;
        }
    },
    actions: {}
});
