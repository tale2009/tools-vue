const base = {
    install(Vue, options) {
        // 初始化form表单
        Vue.prototype.initForm = function (current, form) {
            Object.keys(form).forEach(key => {
                if (!current.hasOwnProperty(key)) {
                    Vue.set(current, key, form[key]);
                }
            });
        };
    }
};

export default base;