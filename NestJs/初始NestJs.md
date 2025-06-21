# 初识NestJs

## 介绍
Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。

在底层，Nest 使用强大的 HTTP Server 框架，如 Express（默认）和 Fastify。Nest 在这些框架之上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块。

## 创建项目

```
npm i -g @nestjs/cli
nest new project-name
```

将会创建 project-name 目录， 安装 node_modules 和一些其他样板文件，并将创建一个 src 目录，目录中包含几个核心文件。

src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts

以下是这些核心文件的简要概述：

| 文件名                    | 描述                                                         |
|-------------------------|------------------------------------------------------------|
| `app.controller.ts`      | 带有单个路由的基本控制器示例。                               |
| `app.controller.spec.ts` | 对于基本控制器的单元测试样例。                               |
| `app.module.ts`          | 应用程序的根模块。                                           |
| `app.service.ts`         | 带有单个方法的基本服务。                                     |
| `main.ts`                | 应用程序入口文件。使用 `NestFactory` 创建 Nest 应用实例。     |

## 模块 module

每个 Nest 应用程序至少有一个模块，即根模块。根模块是 Nest 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的功能。

@Module() 装饰器接受一个描述模块属性的对象：

providers	注入server,可以在controllers控制器中使用
controllers	必须创建的一组控制器
imports	导入模块的列表，导入子模块（如cats）
exports	由本模块提供并应在其他模块中可用的提供者的子集。

```app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule], //导入子模块
  controllers: [AppController], // 注册控制器
  providers: [AppService], // 注册服务
})
export class AppModule {}
```

## 提供者 provider-service

我们已经创建了一个简单的控制器 CatsController 。控制器应处理 HTTP 请求并将更复杂的任务委托给 providers。Providers 是纯粹的 JavaScript 类，在其类声明之前带有 @Injectable()装饰器。

```app.server.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```


## 控制器 controllers

控制器的目的是接收应用的特定请求。路由机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。

```app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

## 注册项目

最后在main.ts中注册AppModule项目，启动服务

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```