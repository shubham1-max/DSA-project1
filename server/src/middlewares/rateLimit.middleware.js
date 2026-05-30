const rateLimit = require("express-rate-limit");

// For AI solve endpoint
const solveLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: "Too many solve requests. Wait a minute and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// For login/register

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many auth attempts. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  solveLimiter,
  authLimiter,
};