const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const responseWrapper = require('./middlewares/responseWrapper');
const requestLogger = require('./middlewares/requestLogger');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;

/* --------- 全局中间件 ---------- */
app.use(express.json());
const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN }
  : {};
app.use(cors(corsOptions));
app.use(responseWrapper); // 统一返回结构
app.use(requestLogger); // 日志

/* --------- JWT 认证 ---------- */
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.fail(401, '未提供令牌');

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.fail(401, '令牌无效或已过期');
    req.userUuid = payload.userUuid;
    next();
  });
}

/* --------- 路由 ---------- */
app.use('/api/auth', authRoutes); // /api/register, /api/login
app.use('/api/todos', authenticateToken, todoRoutes);

/* --------- 404 ---------- */
app.use((req, res) => res.fail(404, '接口不存在'));

/* --------- 启动 ---------- */
app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
