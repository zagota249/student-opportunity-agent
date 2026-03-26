const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

// Strict limiter for job search (API costs money)
const jobSearchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 searches per minute
    message: {
        success: false,
        error: 'Search rate limit exceeded. Please wait a minute.',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

// Strict limiter for auto-apply (TinyFish API costs money)
const autoApplyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 applications per hour
    message: {
        success: false,
        error: 'Auto-apply limit reached. Try again in an hour.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

// Auth limiter (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 login attempts per 15 minutes
    message: {
        success: false,
        error: 'Too many login attempts. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

// Middleware to add rate limit info to response headers
const rateLimitInfo = (req, res, next) => {
    next();
};

module.exports = {
    generalLimiter,
    jobSearchLimiter,
    autoApplyLimiter,
    authLimiter,
    rateLimitInfo
};
