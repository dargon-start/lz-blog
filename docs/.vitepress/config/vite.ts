
import { loadEnv } from 'vitepress'
import type { Plugin, UserConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Inspect from 'vite-plugin-inspect'
import { MarkdownTransform } from '../plugins/markdown-transform'


type ViteConfig = Required<UserConfig>['vite']

export const getViteConfig = ({ mode }: { mode: string }): ViteConfig => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ['legacy-js-api'],
          },
        },
      },
      plugins: [
        vueJsx(),
       // https://github.com/antfu/unplugin-vue-components
        Components({
          dirs: ['/examples'],
  
          allowOverrides: true,
  
          // custom resolvers
          resolvers: [
            // auto import icons
            // https://github.com/antfu/unplugin-icons
            IconsResolver(),
          ],
  
          // allow auto import and register components used in markdown
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        }),
        MarkdownTransform(),
        Inspect(),
      ],
    }
  }