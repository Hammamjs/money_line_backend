import request from 'supertest';
import app from '../../app.js';
import { randomUUID } from 'crypto';
import { usersRepository } from '../../repository/users.repository.js';
import { db } from '../../config/db.js';

beforeEach(async () => {
  await db.query('BEGIN');
});

afterEach(async () => {
  await db.query('ROLLBACK');
});

describe('Test user API', () => {
  describe('GET /api/users/:id', () => {
    it('should return 400 when id not uuid format', async () => {
      const res = await request(app).get('/api/users/1234');

      expect(res.statusCode).toBe(400);
    });

    it('should return 200 when user exists', async () => {
      const user = await usersRepository.create({
        username: `user-${randomUUID()}`,
        email: `${randomUUID()}@example.com`,
        password: 'hashed_pass',
      });

      const res = await request(app).get(`/api/users/${user.id}`);

      expect(res.status).toBe(200);
    });

    it('should return 400 when id is not a valid UUID', async () => {});

    it('should return 404 when user does not exist', async () => {
      const res = await request(app).get(`/api/users/${randomUUID()}`);

      expect(res.status).toBe(404);
    });
  });
});
