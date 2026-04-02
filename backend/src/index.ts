import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { optimize } from './optimizer/engine.js';
import { OPTIMIZATION_PASSES } from './types/index.js';

export const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const optimizeSchema = z.object({
  code: z.string().min(1),
  passes: z.array(z.string()).optional().default(['constant_folding', 'cse', 'dead_code']),
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/passes', (_req, res) => {
  res.json({ passes: OPTIMIZATION_PASSES });
});

app.post('/api/optimize', (req, res) => {
  try {
    const body = optimizeSchema.parse(req.body);
    const allowed = new Set(OPTIMIZATION_PASSES.map(pass => pass.id));
    const unknownPasses = body.passes.filter(pass => !allowed.has(pass));

    if (unknownPasses.length > 0) {
      return res.status(400).json({
        error: 'Invalid passes',
        details: { unknownPasses }
      });
    }

    const result = optimize({
      code: body.code,
      passes: body.passes
    });
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors });
    } else {
      console.error('Optimization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  app.listen(PORT, () => {
    console.log(`🚀 ICO Backend running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Passes: http://localhost:${PORT}/api/passes`);
    console.log(`   Optimize: POST http://localhost:${PORT}/api/optimize`);
  });
}
