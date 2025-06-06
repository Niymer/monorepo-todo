# monorepo-todo

这是一个包含 Node.js 后端和 React 前端的简单待办应用，以单一仓库管理。

## 项目结构

```text
backend/  - 基于 Express + Prisma 的 REST API
frontend/ - 基于 Vite 的 React 客户端
package.json (根目录) - 提供同时运行前后端的脚本
```

## 快速开始

### 全局安装依赖

```bash
pnpm install
```

该命令会在 `backend` 和 `frontend` 两个工作区自动安装依赖。

### 启动后端

```bash
cd backend
pnpm run dev        # 默认端口 http://localhost:3000
```

首次启动前需要配置 `.env`，并同步数据库：

```bash
npx prisma db push
```

### 启动前端

```bash
cd frontend
pnpm run dev        # 默认端口 http://localhost:5173
```

前端在开发模式下会将 `/api` 请求代理到后端。

### 一键启动

在仓库根目录执行：

```bash
pnpm run dev
```



该脚本会同时启动前端、后端和 Prisma Studio。

### 代码检查与格式化

```bash
pnpm lint
pnpm format
```

### 运行测试

```bash
pnpm test
```

该命令等同于 `pnpm --filter todo-backend test`，仅执行后端 Jest 用例。


## 环境变量示例

```ini
# backend/.env
DATABASE_URL="postgresql://todo_user:123456@localhost:5432/todo_database?schema=public"
JWT_SECRET="todo_secret"
JWT_SESSION_DURATION="2h"

# frontend/.env.development
VITE_API_BASE_URL="http://localhost:3000/api"
```

## 功能概览

- 用户注册与登录（JWT 鉴权）
- 待办创建、编辑、完成状态切换与删除
- React 客户端基于 Ant Design 和 React Hook Form
