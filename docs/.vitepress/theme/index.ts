import { useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'

import DemoBlock from '../components/DemoBlock.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    const app = ctx.app
    app.use(ElementPlus)
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    app.component('vImageViewer', vImageViewer); // 注册全局组件（可选）
    app.component('DemoBlock', DemoBlock)
  },
  setup() {
    const route = useRoute();
    imageViewer(route); // 启用插件
  }
};