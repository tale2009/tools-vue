const base = {
    install(Vue, options) {
        Vue.prototype.fileToBase64 = function (file) {
            return new Promise(((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (res) => {
                    resolve(res);
                };
                reader.onerror = (err) => {
                    reject(err);
                };
                reader.readAsDataURL(file);
            }));
        };
    }
};

export default base;