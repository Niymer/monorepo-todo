const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const prisma = require('../utils/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SESSION_DURATION = process.env.JWT_SESSION_DURATION || '2h';

/** 注册 */
router.post(
  '/register',
  [
    check('email').isEmail().withMessage('邮箱格式不正确'),
    check('password').isLength({ min: 6 }).withMessage('密码长度至少6位'),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.fail(400, '邮箱和密码为必填项');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.fail(400, errors.array()[0].msg);

    try {
      const exist = await prisma.user.findUnique({ where: { email } });
      if (exist) return res.fail(409, '邮箱已注册');

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashed },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_SESSION_DURATION,
      });
      res.success({ token }, '注册成功');
    } catch (err) {
      console.error(err);
      res.fail(500, '注册失败');
    }
  },
);

/** 登录 */
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('邮箱格式不正确'),
    check('password').isLength({ min: 6 }).withMessage('密码长度至少6位'),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.fail(400, '邮箱和密码为必填项');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.fail(400, errors.array()[0].msg);

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.fail(404, '用户不存在');

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.fail(401, '密码错误');

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_SESSION_DURATION,
      });
      res.success({ token }, '登录成功');
    } catch (err) {
      console.error(err);
      res.fail(500, '登录失败');
    }
  },
);

module.exports = router;
