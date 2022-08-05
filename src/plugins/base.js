import mime from 'mime';
import dayjs from 'dayjs';
import config from '@/assets/json/config.json';

export default {
  install(app, options) {
    app.config.globalProperties.config = config;

    app.config.globalProperties.formatTime = value => dayjs(value).format('YYYY-MM-DD HH:mm:ss');

    app.config.globalProperties.timeFormatter = (row, column, cellValue, index) => dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');

    app.config.globalProperties.formatList = (value, list, listLabel = 'label', listValue = 'value') => {
      const item = list.find(item => value === item[listValue]);
      if (item) {
        return item[listLabel];
      }
      return '';
    };

    app.config.globalProperties.downloadBlob = function (blob, fileName) {
      if (!fileName) {
        fileName = new Date().getTime();
      }
      const extension = mime.getExtension(blob.type);
      const a = document.createElement('a');
      a.download = `${fileName}.${extension}`;
      a.href = URL.createObjectURL(blob);
      a.click();
      gtag('event', '文件下载');
    };

    app.config.globalProperties.dataURLtoFile = function (dataUrl, fileName) {
      const arr = dataUrl.split(',');
      const type = arr[0].match(/:(.*?);/)[1];
      const extension = mime.getExtension(type);
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${fileName}.${extension}`, { type });
    };
  },
};
