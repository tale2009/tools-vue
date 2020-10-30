import Vuex from 'vuex';

export default Vuex.createStore({
    state: {
        collapse: false
    },
    mutations: {
        setCollapse(state) {
            state.collapse = !state.collapse;
        }
    },
    actions: {}
});
