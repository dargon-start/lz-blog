# react-query 基础用法


## 🧩 1. `QueryClient` —— 全局配置客户端

### 作用
创建一个全局的查询客户端实例，用于：
- 配置默认选项（如重试、缓存时间）
- 管理所有查询和 mutation 的状态

### 示例（入口文件中初始化）

```tsx
// main.tsx 或 index.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟内数据视为新鲜
      retry: 1,                 // 失败时重试1次
      refetchOnWindowFocus: false, // 聚焦时不自动 refetch
    },
    mutations: {
      retry: 0, // mutation 默认不重试（根据业务决定）
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} /> {/* 开发工具 */}
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## 🔍 2. `useQuery` —— 获取数据（GET）

### 基本用法

```ts
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['users', page, search], // 唯一标识，数组形式支持动态参数
  queryFn: () => fetchUsers(page, search), // 返回 Promise
  enabled: !!search, // 可选：条件触发（如搜索词非空才请求）
});
```

### 完整示例

```ts
// hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return res.data;
};

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 30, // 30秒内不重新请求
  });
};
```

### 常用返回值
| 属性 | 说明 |
|------|------|
| `data` | 成功返回的数据 |
| `isLoading` | 是否正在首次加载 |
| `isFetching` | 是否正在后台获取（包括 refetch）|
| `isError` / `error` | 错误状态和错误对象 |
| `refetch` | 手动触发重新请求 |
| `isSuccess` | 是否成功 |

---

## 🔄 3. `useMutation` —— 修改数据（POST/PUT/DELETE）

### 基本用法

```ts
const mutation = useMutation({
  mutationFn: (newUser) => createUser(newUser),
  onSuccess: (data) => {
    // 成功后更新缓存或提示
  },
  onError: (error) => {
    // 处理错误
  },
});

// 触发
mutation.mutate({ name: 'Alice', email: 'alice@example.com' });
```

### 完整示例

```ts
// hooks/useCreatePost.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface NewPost {
  title: string;
  body: string;
  userId: number;
}

const createPost = async (post: NewPost) => {
  const res = await axios.post('https://jsonplaceholder.typicode.com/posts', post);
  return res.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 使相关查询失效，自动重新获取
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('创建失败:', error);
    },
  });
};
```

### 常用属性
| 属性 | 说明 |
|------|------|
| `mutate` | 触发 mutation |
| `isPending`（v5）或 `isLoading`（v4） | 是否正在提交 |
| `isError` / `error` | 错误信息 |
| `data` | 成功返回的数据 |
| `reset` | 重置 mutation 状态（常用于表单提交后清空错误）|

---

## 🧠 4. `useQueryClient` —— 手动操作缓存

### 作用
在组件或 hook 中访问全局 `QueryClient` 实例，用于：

- 乐观更新（`setQueryData`）
- 使查询失效（`invalidateQueries`）
- 预取数据（`prefetchQuery`）
- 取消查询等

### 常用方法

```ts
const queryClient = useQueryClient();

// 1️⃣ 乐观更新：立即修改缓存（无需等待网络）
queryClient.setQueryData(['posts'], (old: Post[] | undefined) => [
  ...old || [],
  newPost
]);

// 2️⃣ 使查询失效（下次使用时自动 refetch）
queryClient.invalidateQueries({ queryKey: ['posts'] });

// 3️⃣ 精确失效（带参数）
queryClient.invalidateQueries({ queryKey: ['posts', { status: 'draft' }] });

// 4️⃣ 预取数据（用于 hover 预加载等）
await queryClient.prefetchQuery({
  queryKey: ['post', postId],
  queryFn: () => fetchPost(postId),
});

// 5️⃣ 移除缓存（如登出时）
queryClient.removeQueries({ queryKey: ['user'] });
```

### 示例：删除用户时乐观更新

```ts
const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onMutate: async (id) => {
      // 1. 取消正在进行的 refetch
      await queryClient.cancelQueries({ queryKey: ['users'] });
      // 2. 快照当前数据
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      // 3. 乐观更新：立即移除
      queryClient.setQueryData(['users'], (old) =>
        old ? old.filter(u => u.id !== id) : []
      );
      // 4. 返回上下文（用于回滚）
      return { previousUsers };
    },
    onError: (err, id, context) => {
      // 回滚
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      // 最终确保数据一致（可选）
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

---

## 📌 总结：何时用哪个？

| 场景 | 使用 |
|------|------|
| 获取列表、详情 | `useQuery` |
| 提交表单、删除、编辑 | `useMutation` |
| 更新缓存、预加载、清除数据 | `useQueryClient` |
| 全局配置（重试、缓存时间等） | `new QueryClient()` |

---

✅ **最佳实践建议**：
- 所有数据请求封装为自定义 Hook；
- Mutation 成功后优先使用 `setQueryData` 做乐观更新，其次 `invalidateQueries`；
- 合理设置 `staleTime` 减少不必要的请求；
- 开发时开启 `ReactQueryDevtools` 调试。

---
