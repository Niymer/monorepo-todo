// middlewares/requestLogger.js
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  res.on('finish', () => {
    logger.info(
      `URL:${req.originalUrl}, User:${
        req.userId || 'GUEST'
      }, Operation:${req.method}_${req.originalUrl.toUpperCase()}`,
    );
  });
  next();
};
