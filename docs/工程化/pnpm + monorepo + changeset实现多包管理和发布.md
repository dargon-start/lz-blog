# pnpm + monorepo + changeset实现多包管理和发布

## npm 发包网络超时问题：
1. 打开vpn
2. 配置npm 代理 npm config set proxy http://127.0.0.1:7890


## 发布monerepo包
发布monerepo包需要在npm上创建Organizations
![Alt text](./images/image-2.png)

使用changeset 工具发包
1. pnpm install @changesets/cli -w --save-dev 下载工具
2. pnpm changeset init 初始化
3. 执行命令pnpm changeset 或 pnpm changeset add，该命令将询问一系列问题，首先是您要发布的包，然后是每个包的semver bump类型，然后是整个变更集的摘要。在最后一步，它将显示它将生成的变更集，并确认您要添加它。
4. 执行 pnpm changeset publish 发布