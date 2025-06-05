// Prisma Client 初始化
const { PrismaClient } = require('@prisma/client');

// 初始化 Prisma 客户端
const prisma = new PrismaClient();

// 捕获程序结束信号，确保 Prisma 正常断开连接
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  throw new Error('SIGINT');
});

module.exports = prisma;
