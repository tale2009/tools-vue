const base = {
    install(Vue, options) {
        Vue.prototype.fileToDataURL = function (file) {
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

        Vue.prototype.dataURLtoBlob = function (dataURL) {
            let arr = dataURL.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
        };
    }
};

export default base;