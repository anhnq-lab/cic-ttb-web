const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const setupSecurity = (app) => {
    // 1. Helmet: Secure HTTP Headers
    app.use(helmet());

    // 2. Rate Limiting: Prevent DDoS/Spam
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: { error: "Too many requests from this IP, please try again after 15 minutes" },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    // Apply to all API routes
    app.use('/api', limiter);
};

module.exports = setupSecurity;
