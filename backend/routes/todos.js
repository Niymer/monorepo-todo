const express = require('express');
const prisma = require('../utils/db');

const router = express.Router();

/** 获取todo（分页） */
router.get('/getPage', async (req, res) => {
  const pageNum = Math.max(parseInt(req.query.pageNum) || 1, 1);
  const pageSize = Math.max(parseInt(req.query.pageSize) || 10, 1);
  const orderBy = (req.query.orderBy || 'createTime desc').toLowerCase();
  const keyword = (req.query.keyword || '').trim();
  const doneRaw = req.query.done;

  const skip = (pageNum - 1) * pageSize;
  const take = pageSize;

  const where = {
    userUuid: req.userUuid,
    isDelete: -1,
    ...(doneRaw !== undefined
      ? { done: ['true', '1', true].includes(doneRaw) }
      : {}),
    ...(keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  try {
    const total = await prisma.todo.count({ where });
    const list = await prisma.todo.findMany({
      where,
      orderBy: orderBy.includes('asc')
        ? { createdAt: 'asc' }
        : { createdAt: 'desc' },
      skip,
      take,
    });

    res.successList({ list, total });
  } catch (err) {
    console.error(err);
    res.fail(500, '查询失败');
  }
});

/** 新建  */
router.post('/add', async (req, res) => {
  const { title, description, priority = 'LOW', dueDate } = req.body;
  if (!title) return res.fail(400, '标题不能为空');

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        priority: priority.toUpperCase(),
        dueDate: dueDate ? new Date(dueDate) : null,
        userUuid: req.userUuid,
      },
    });
    res.success(todo, '新增成功');
  } catch (err) {
    console.error(err);
    res.fail(500, '新增失败');
  }
});

/** 完成 / 取消完成 */
router.patch('/:uuid/toggle', async (req, res) => {
  try {
    // 1️⃣ 先查找这条 todo 是否属于当前用户
    const todo = await prisma.todo.findFirst({
      where: { uuid: req.params.uuid, userUuid: req.userUuid },
    });
    if (!todo) return res.fail(404, '记录不存在');

    // 2️⃣ 把 done 取反后写回
    const updated = await prisma.todo.update({
      where: { uuid: todo.uuid }, // 只用唯一主键
      data: { done: { set: !todo.done } },
    });

    res.success(updated, '更新成功');
  } catch (err) {
    console.error(err);
    res.fail(500, '更新失败');
  }
});
/** 编辑 （可改 priority / description / title / dueDate） */
router.patch('/:uuid/edit', async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  // 至少要传一个可修改字段
  if (!title && !description && !priority && !dueDate)
    return res.fail(400, '请至少提供一个要修改的字段');

  try {
    // ① 校验归属
    const todo = await prisma.todo.findFirst({
      where: { uuid: req.params.uuid, userUuid: req.userUuid },
    });
    if (!todo) return res.fail(404, '记录不存在');

    // ② 组装更新数据
    const data = {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(priority ? { priority: priority.toUpperCase() } : {}),
      ...(dueDate !== undefined
        ? { dueDate: dueDate ? new Date(dueDate) : null }
        : {}),
    };

    // ③ 更新
    const updated = await prisma.todo.update({
      where: { uuid: todo.uuid },
      data,
    });
    res.success(updated, '更新成功');
  } catch (err) {
    console.error(err);
    res.fail(500, '更新失败');
  }
});

/** 删除 */
router.delete('/:uuid/delete', async (req, res) => {
  try {
    const todoId = req.params.uuid;
    // 如果你的 Prisma schema 里 uuid 是 Int，就写：
    // const todoId = Number(req.params.uuid)

    // ① 验证：属于当前用户 & 还没被删
    const todo = await prisma.todo.findFirst({
      where: {
        uuid: todoId,
        userUuid: req.userUuid,
        isDelete: -1, // 只查“未删除”的
      },
    });
    if (!todo) {
      return res.fail(404, '记录不存在或已删除');
    }

    // ② 软删除：把 isDelete 从 -1 改成 1
    await prisma.todo.update({
      where: { uuid: todoId },
      data: { isDelete: 1 },
    });

    res.success(null, '删除成功');
  } catch (err) {
    console.error(err);
    res.fail(500, '删除失败');
  }
});

module.exports = router;
