import router from '../router';
import {Message} from 'element-plus';

// 启用路由拦截
router.beforeEach((to, from, next) => {
    if (!router.resolve(to.path).matched.length) {
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
