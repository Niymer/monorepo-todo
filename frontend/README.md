# 前端项目

该应用基于 **React + Vite** 构建，UI 库采用 **Ant Design**，用于与后端 REST API 交互的待办事项客户端。

## 常用命令

在 `frontend` 目录下可运行以下脚本：

```bash
pnpm run dev      # 本地开发模式，端口默认为 5173
pnpm run build    # 构建生产环境静态文件
pnpm run preview  # 预览构建后的应用
```

## 环境变量

在启动前，请先将 `frontend/.env.example` 复制为 `frontend/.env.development`（生产构建可复制为 `frontend/.env.production`）。
该文件提供了 `VITE_API_BASE_URL`，默认值为 `http://localhost:3000/api`。`vite.config.ts` 中配置了代理，将以 `/api` 开头的请求转发到该地址。

## 目录结构

```text
src/
  assets/       # 静态资源
  components/   # 可复用的 React 组件
  pages/        # 页面组件
  services/     # 与后端交互的请求封装
  hooks/        # 自定义 hooks
  context/      # React Context 定义
  styles/       # 全局样式
  utils/        # 工具函数
```

更多关于整个仓库的使用方式，请查看 [根目录 README](../README.md)。
