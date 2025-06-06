const { v4: uuidv4 } = require('uuid');

let users = [];
let todos = [];

function reset() {
  users = [];
  todos = [];
}

const db = {
  user: {
    async findUnique({ where: { email } }) {
      return users.find((u) => u.email === email) || null;
    },
    async create({ data }) {
      const user = { ...data, uuid: uuidv4(), createdAt: new Date() };
      users.push(user);
      return user;
    },
  },
  todo: {
    async count({ where } = {}) {
      return todos.filter((t) => match(t, where)).length;
    },
    async findMany({ where, orderBy, skip = 0, take = todos.length } = {}) {
      let list = todos.filter((t) => match(t, where));
      if (orderBy && orderBy.createdAt === 'asc') list.sort((a, b) => a.createdAt - b.createdAt);
      else list.sort((a, b) => b.createdAt - a.createdAt);
      return list.slice(skip, skip + take);
    },
    async findFirst({ where }) {
      return todos.find((t) => match(t, where)) || null;
    },
    async create({ data }) {
      const todo = {
        ...data,
        uuid: uuidv4(),
        done: data.done ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDelete: -1,
      };
      todos.push(todo);
      return todo;
    },
    async update({ where, data }) {
      const idx = todos.findIndex((t) => t.uuid === where.uuid);
      if (idx === -1) throw new Error('Todo not found');
      const todo = todos[idx];
      if (data.done && typeof data.done === 'object' && 'set' in data.done) {
        todo.done = data.done.set;
      }
      if (data.isDelete !== undefined) todo.isDelete = data.isDelete;
      if (data.title !== undefined) todo.title = data.title;
      if (data.description !== undefined) todo.description = data.description;
      if (data.priority !== undefined) todo.priority = data.priority;
      if (data.dueDate !== undefined) todo.dueDate = data.dueDate ? new Date(data.dueDate) : null;
      todo.updatedAt = new Date();
      todos[idx] = todo;
      return todo;
    },
  },
  reset,
};

function match(t, where = {}) {
  if (!where) return true;
  if (where.uuid && t.uuid !== where.uuid) return false;
  if (where.userUuid && t.userUuid !== where.userUuid) return false;
  if (where.isDelete !== undefined && t.isDelete !== where.isDelete) return false;
  if (where.done !== undefined && t.done !== where.done) return false;
  return true;
}

module.exports = db;
