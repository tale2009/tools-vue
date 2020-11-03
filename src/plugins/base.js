const mime = require('mime');

const base = {
    install(Vue, options) {
        Vue.prototype.config = require('@/assets/json/config.json');
        //重置表单
        Vue.prototype.resetForm = function (formName) {
            if (this.$refs[formName]) {
                this.$refs[formName].resetFields();
            }
        };

        Vue.filter('timeFilter', function (value) {
            if (value) {
                return Vue.prototype.dayjs(value).format('YYYY-MM-DD HH:mm:ss');
            }
        });

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

        Vue.prototype.downloadBlob = function (blob, fileName) {
            if (!fileName) {
                fileName = new Date().getTime();
            }
            let a = document.createElement('a');
            let extension = mime.getExtension(blob.type);
            a.download = `${fileName}.${extension}`;
            a.href = URL.createObjectURL(blob);
            a.click();
        };
    }
};

export default base;
