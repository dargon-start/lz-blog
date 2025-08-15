# 创建pnpm workspace项目

## 初始化项目

1. pnpm init初始化项目
2. 创建`pnpm-workspace.yaml`文件

```yaml
packages:
  - "internal/*"
  - "internal/lint-configs/*"
  - "packages/*"
  - "packages/@core/base/*"
  - "packages/@core/ui-kit/*"
  - "packages/@core/forward/*"
  - "packages/@core/*"
  - "packages/effects/*"
  - "packages/business/*"
  - "apps/*"
  - "scripts/*"
  - "docs"
  - "playground"
```

3. 创建apps、packages等文件目录
4. 在apps中创建应用、packages中创建通用包
5. 在packages.json中编写scripts

项目的packages.json中name要定义好，然后在workspace中运行

```json
{
  "name": "lz-admin",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev:next":"pnpm -F @lz/next-antd run dev" // 运行@lz/next-antd项目
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```



### 在workspace中，引用其他子包
需要引用其他子包时，需要先在`.npmrc`中设置`link-workspace-packages=true`



如果 [link-workspace-packages](https://pnpm.io/settings#link-workspace-packages) 设置为 `true`，pnpm 将会链接工作区中的包，如果可用的包符合声明的范围。例如，如果 `bar` 的依赖中有 `"foo": "^1.0.0"`，且 `foo@1.0.0` 在工作区中，那么 `foo@1.0.0` 将被链接到 `bar` 中。然而，如果 `bar` 的依赖中有 `"foo": "2.0.0"`，且 `foo@2.0.0` 不在工作区中，那么 `foo@2.0.0` 将从注册表中安装。这种行为会引入一些不确定性。

  


