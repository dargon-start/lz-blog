# vite+react创建项目模版


## 使用vite来初始化项目

`pnpm create vite@latest lz-template-react -- --template react-swc-ts`

## 引入tailwindcss


`
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
`

安装tailwindcss后，执行init是会报错，原因是由于tailwindcss版本过高造成的。降低tailwindcss版本即可（官网最新版本是3.4.17）

`pnpm install tailwindcss@3.4.17 -D`


## tailwindcss使用antd5的token变量

问题：当我们使用tailwindcss编写类时，想要使用antd5的token,应该如何解决呢？

方案：

1. 在全局style中定义css变量，css变量使用antd5的token值；
2. 然后在tailwind.config.js预设样式，使用css全局变量；

``` tsx
// ThemeProvider.tsx
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeMode, themeColorPresets } = useSettings()

  const tm = themeMode === ThemeMode.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: tm,
          token: {
            colorPrimary: presetsColors[themeColorPresets]
          }
        }}
      >
        {children}
        <CssTheme></CssTheme>
      </ConfigProvider>
    </>
  )
}

// CssTheme.tsx
import { theme } from 'antd'

const { useToken } = theme
export default function CssTheme() {
  let { token } = useToken()
  console.log(token, 'token')

  const globalVars = `html {
    --ant-color-primary: ${token.colorPrimary};
    --ant-color-primary-hover: ${token.colorPrimaryHover};
  }`
  return <style>{globalVars}</style>
}

// tailwind.config.js
/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: 'var(--ant-color-primary)',
      'primary-hover': 'var(--ant-color-primary-hover)'
    },
    extend: {}
  },
  plugins: []
}

```
