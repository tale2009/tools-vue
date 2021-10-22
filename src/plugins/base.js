import mime from 'mime';
import dayjs from 'dayjs';
import config from '@/assets/json/config.json';

export default {
    install(app, options) {
        app.config.globalProperties.config = config;

        app.config.globalProperties.formatTime = value => dayjs(value).format('YYYY-MM-DD HH:mm:ss');

        app.config.globalProperties.downloadBlob = function (blob, fileName) {
            if (!fileName) {
                fileName = new Date().getTime();
            }
            const extension = mime.getExtension(blob.type);
            const a = document.createElement('a');
            a.download = `${fileName}.${extension}`;
            a.href = URL.createObjectURL(blob);
            a.click();
        };
    }
};
