import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import path from 'path';
import fs from 'fs';

// 保存配置文件
function saveConfig() {
    if (process.env.NODE_ENV === 'production') {
        const config = {
            updateTime: new Date().getTime()
        };
        fs.writeFileSync('./src/assets/json/config.json', JSON.stringify(config));
    }
    return {
        name: 'save-config'
    };
}

export default defineConfig({
    base: './',
    plugins: [
        vue(),
        viteCompression({
            threshold: 10240   // 超过10k压缩
        }),
        saveConfig()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']  // 扩展了.vue后缀
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import './src/styles/variable.scss';`
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 8010
    }
});
