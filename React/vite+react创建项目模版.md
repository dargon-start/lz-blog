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
