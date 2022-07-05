import { h } from 'vue';
import { ElImage } from 'element-plus';

export default {
  name: 'ElImageExtend',
  render() {
    const propsAndAttrs = { ...this.$props, ...this.$attrs };

    return h(ElImage, {
      'v-bind': propsAndAttrs,
      key: propsAndAttrs.src,
    }, this.$slots);
  },
};
