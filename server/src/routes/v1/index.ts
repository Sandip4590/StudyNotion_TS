import { timeStamp } from 'console';
import { Router } from 'express';
import { version } from 'os';

const router = Router();

import authRoutes from '@/routes/v1/auth';

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'App iS Live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.Ed-Tech-Api.codewithSendy.com',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
export default router;
