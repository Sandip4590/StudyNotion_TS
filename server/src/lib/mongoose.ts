import mongoose from 'mongoose';
import config from '@/config';
import type { ConnectOptions } from 'mongoose';
import { logger } from '@/lib/winston';

const clientOptions: ConnectOptions = {
  dbName: 'My-DB',
  appName: 'Study-Notion-APi',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDataBase = async (): Promise<void> => {
  if (!config.MONGO_URL) {
    throw new Error('MongoDB URL is not defined in the configuration');
  }

  try {
    await mongoose.connect(config.MONGO_URL, clientOptions);
    logger.info('Connected to the Database SuccessFully', {
      url: config.MONGO_URL,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error('Error While Connecting the database', error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.warn('Disconnected From DataBase', {
      url: config.MONGO_URL,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error('Error While Connecting the database', error);
  }
};
