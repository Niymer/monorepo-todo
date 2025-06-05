# 后端服务说明

基于 **Express** 与 **Prisma** 的待办应用 REST API。提供用户认证与待办管理接口，
默认监听 `3000` 端口。

## 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

该命令会为 `backend` 工作区安装所有依赖。

## 环境变量

在 `backend/.env` 中配置下列变量：

```ini
DATABASE_URL=...         # PostgreSQL 连接串
JWT_SECRET=...           # JWT 签名密钥
JWT_SESSION_DURATION=... # JWT 有效期，如 2h
CORS_ORIGIN=...          # 允许的跨域来源，可留空
PORT=3000                # 服务端口，可不填
```

## 数据库初始化

首次启动前需要同步数据库结构：

```bash
npx prisma db push            # 根据 schema 创建表
pnpm --filter todo-backend run migrate    # 若存在迁移脚本
```

## 启动服务

```bash
pnpm --filter todo-backend run dev
```

启动后可访问 `http://localhost:3000`。

## API 简介

- `POST /api/auth/register` 与 `POST /api/auth/login`：用户注册与登录，返回 JWT。
- `/api/todos`：认证后进行待办的增删改查。

更详细的调试步骤与常见问题，请查阅 [`docs/debug-guide.md`](../docs/debug-guide.md)。
