const winston = require("winston");
const path = require("path");

module.exports = winston.createLogger({
  // define log format such as timestamp, color and message structure to display
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.colorize(),
    winston.format.printf((log) => {
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // support write log to file just in case needed
    // new winston.transports.File({
    //   level: "error",
    //   filename: path.join(__dirname, "errors.log"),
    // }),
  ],
});
