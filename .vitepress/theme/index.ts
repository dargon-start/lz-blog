import { useRoute }  from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "../components/Layout.vue";
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import './customize.css'; // 自定义样式

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('vImageViewer', vImageViewer); // 注册全局组件（可选）
    // 如果不是完全自定义主题,需要执行主题的默认行为
    DefaultTheme.enhanceApp({ app, router, siteData });
  },
  setup() {
    // 如果不是完全自定义主题,需要执行主题的默认行为
    const route = useRoute(); 
    imageViewer(route); // 启用插件
  }
} 