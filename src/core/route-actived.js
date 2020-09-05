import router from '../router';
import {Message} from 'element-ui';

// 启用路由拦截
router.beforeEach((to, from, next) => {
    if (!router.match(to.path).matched.length) {
        Message.warning('页面不存在');
        router.go(-1);
    } else {
        setDocumentTitle(to);
        next();
    }
});

// 设置文档标题
function setDocumentTitle(to) {
    document.title = `${to.meta.title} - kooriookami`;
}