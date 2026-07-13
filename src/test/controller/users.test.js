import request from 'supertest';
import app from '../../app.js';

describe('Test user API', () => {
  describe('test get users route', () => {
    it('test get users endpoint', async () => {
      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
    });
  });

  describe('test get user by id', () => {
    it('should return 400 when id not uuid format', async () => {
      const res = await request(app).get('/api/users/1234');

      expect(res.statusCode).toBe(400);
    });
  });
});
