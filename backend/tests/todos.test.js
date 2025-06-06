process.env.JWT_SECRET = 'test_secret';

jest.mock('../utils/db', () => require('./memoryDb'));

const request = require('supertest');
const app = require('../index');
const db = require('../utils/db');

describe('Todo API', () => {
  beforeEach(() => db.reset());

  async function authToken() {
    const email = 'todo@example.com';
    const password = '123456';
    await request(app).post('/api/auth/register').send({ email, password });
    const res = await request(app).post('/api/auth/login').send({ email, password });
    return res.body.data.token;
  }

  test('full CRUD flow', async () => {
    const token = await authToken();
    const authHeader = { Authorization: `Bearer ${token}` };

    let res = await request(app)
      .post('/api/todos/add')
      .set(authHeader)
      .send({ title: 'T1', description: 'd1' });
    expect(res.status).toBe(200);
    const id = res.body.data.uuid;

    res = await request(app).get('/api/todos/getPage').set(authHeader);
    expect(res.body.data.length).toBe(1);

    res = await request(app)
      .patch(`/api/todos/${id}/toggle`)
      .set(authHeader);
    expect(res.body.data.done).toBe(true);

    res = await request(app)
      .patch(`/api/todos/${id}/edit`)
      .set(authHeader)
      .send({ description: 'updated' });
    expect(res.body.data.description).toBe('updated');

    await request(app)
      .delete(`/api/todos/${id}/delete`)
      .set(authHeader)
      .expect(200);

    res = await request(app).get('/api/todos/getPage').set(authHeader);
    expect(res.body.data.length).toBe(0);
  });
});
