import dotenv from 'dotenv';
import type ms from 'ms'

dotenv.config();

const config = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV,
    WHITLIST_ORIGINS: ["http://localhost:3000", 'https://docs.blog-api.codewithsendy'],// add my frontend URL
    MONGO_URL: process.env.MONGO_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRE: (process.env.JWT_ACCESS_EXPIRE || "15m").replace(",", "") as ms.StringValue,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_EXPIRE as string,
    JWT_REFRESH_EXPIRE: (process.env.JWT_REFRESH_EXPIRE || "7d").replace(",", "") as ms.StringValue,
    WHITELIST_ADMINS_MAIL: [
        'sandipkthakor8990@gmail.com',
        'imsendy1288@gmail.com'
    ],
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT:465


};

export default config;