import { h } from 'vue';
import { ElImage } from 'element-plus';

export default {
  name: 'ElImageExtend',
  render() {
    return h(ElImage, {
      key: this.$attrs.src,
    }, this.$slots);
  },
};
