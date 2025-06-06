process.env.JWT_SECRET = 'test_secret';

jest.mock('../utils/db', () => require('./memoryDb'));

const request = require('supertest');
const app = require('../index');
const db = require('../utils/db');

describe('Auth API', () => {
  beforeEach(() => db.reset());

  test('register and login', async () => {
    const email = 'test@example.com';
    const password = '123456';

    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password });
    expect(regRes.status).toBe(200);
    expect(regRes.body.data.token).toBeDefined();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.token).toBeDefined();
  });
});
