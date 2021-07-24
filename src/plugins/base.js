import dayjs from 'dayjs';

export default {
    install(app, options) {
        app.config.globalProperties.config = require('@/assets/json/config.json');

        app.config.globalProperties.formatTime = value => dayjs(value).format('YYYY-MM-DD HH:mm:ss');

        app.config.globalProperties.downloadBlob = function (blob, fileName) {
            if (!fileName) {
                fileName = new Date().getTime();
            }
            let a = document.createElement('a');
            a.download = fileName;
            a.href = URL.createObjectURL(blob);
            a.click();
        };
    }
};
