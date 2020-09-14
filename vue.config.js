const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    publicPath: './',
    productionSourceMap: false, //打包不生成map文件
    devServer: {
        port: 8100
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import './src/style/variable.scss';`
            }
        }
    },
    configureWebpack: {
        plugins: [
            new CompressionPlugin({
                test: /\.(js|css)$/,
                threshold: 10240,   // 超过10k压缩
                deleteOriginalAssets: false // 删除源文件
            })
        ]
    }
};
