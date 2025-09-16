import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import config from '@/config';
import type { CorsOptions } from 'cors';
import limiter from '@/lib/express_rate_limit';
import { logger } from '@/lib/winston';
import { connectToDataBase, disconnectFromDatabase } from '@/lib/mongoose';

import v1Routes from '@/routes/v1';
const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITLIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error:${origin} is not allowed by CORS`), false);
    }
  },
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
); // for encode to decode
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(helmet()); // enhance security by setting various HTTP headers
app.use(limiter); // ratelimit middleware to prevent excessive req and enhance security

(async () => {
  try {
    await connectToDataBase();
    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Srever Running : http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed To Start server');

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

//pending routes 50:02

const handleServerShutDown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server ShutDown ');
    process.exit(0);
  } catch (error) {
    logger.error('Error While Server ShutDown');
  }
};

process.on('SIGTERM', handleServerShutDown);
process.on('SIGINT', handleServerShutDown);
