import { describe, it, expect } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

describe('API /api/optimize', () => {
  it('optimizes code and returns metrics', async () => {
    const { app } = await import('../index.js');
    const response = await request(app)
      .post('/api/optimize')
      .send({
        code: 't1 = 2 + 3\nt2 = t1 + 1',
        passes: ['constant_folding', 'constant_propagation']
      });

    expect(response.status).toBe(200);
    expect(response.body.optimizedCode).toBe('t1 = 5\nt2 = 5 + 1');
    expect(response.body.metrics.before.instructionCount).toBe(2);
    expect(response.body.metrics.after.instructionCount).toBe(2);
  });

  it('rejects unknown passes', async () => {
    const { app } = await import('../index.js');
    const response = await request(app)
      .post('/api/optimize')
      .send({ code: 't1 = 1', passes: ['not_a_pass'] });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid passes');
    expect(response.body.details.unknownPasses).toEqual(['not_a_pass']);
  });
});
