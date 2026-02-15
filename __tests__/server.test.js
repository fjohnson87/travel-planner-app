const request = require('supertest');
const app = require('../src/server/server');

describe('GET /health', () => {
  test('returns ok:true', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
