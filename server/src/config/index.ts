import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT : process.env.PORT || 4000,
    NODE_ENV : process.env.NODE_ENV,
    WHITLIST_ORIGINS:["http://localhost:3000",'https://docs.blog-api.codewithsendy'] // add my frontend URL

};

export default config ;