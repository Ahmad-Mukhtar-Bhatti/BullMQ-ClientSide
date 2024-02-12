/* eslint-disable no-undef */
const winston = require("winston");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "reactapp.log" }),
  ],
});

module.exports = logger;