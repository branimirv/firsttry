import { Router } from 'express';

const router: Router = Router();

router.get('/ping', (_req, res) => {
  res.json({ ok: true, ts: Date.now().toString() });
});

export default router;
