import router from './index';
import store from '../store';
import { ElMessage } from 'element-plus';
import { nextTick } from 'vue';

// 启用路由拦截
router.beforeEach((to, from, next) => {
  if (!router.resolve(to.path).matched.length) {
    ElMessage.warning('页面不存在');
    next(from.fullPath);
  } else {
    setDocumentTitle(to);
    next();
  }
});

router.afterEach(() => {
  nextTick().then(() => {
    store.commit('setLeftCollapse', false);
    store.commit('setRightCollapse', false);
  });
});

// 设置文档标题
function setDocumentTitle(to) {
  document.title = `${to.meta.title} - kooriookami`;
}
