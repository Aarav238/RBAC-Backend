const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    msg: err.message,
    // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack, // Uncomment for stack trace in development
  });
};

module.exports = errorHandler;
