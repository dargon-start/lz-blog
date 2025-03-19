import DefaultTheme from 'vitepress/theme';
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import { useRoute } from 'vitepress';
import DemoBlock from '../components/DemoBlock.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('vImageViewer', vImageViewer); // 注册全局组件（可选）
    ctx.app.component('DemoBlock', DemoBlock)
  },
  setup() {
    const route = useRoute();
    imageViewer(route); // 启用插件
  }
};