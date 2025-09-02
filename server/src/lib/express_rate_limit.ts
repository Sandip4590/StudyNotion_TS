
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs:6000, // 1-minute time window for request limiting
    limit:60, // allow a max of 60 req per window per IP
    standardHeaders:'draft-8', // use the latest standard rate-limit headers
    legacyHeaders:false, // disable deprecated x-Ratelimit headres
    message:{
        error:'You Have Sent Too Many Request in a given amount of time. Please try again later.'
    }
})

export default limiter ;