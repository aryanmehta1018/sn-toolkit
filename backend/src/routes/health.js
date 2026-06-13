import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'sn-toolkit-api',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});
