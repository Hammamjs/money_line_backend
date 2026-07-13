import request from 'supertest';
import app from '../app.js';

describe('Express app', () => {
  it('should return unknow when the accessing wrong route', async () => {
    const res = await request(app).get('/unknown');

    expect(res.statusCode).toBe(404);
  });
});
