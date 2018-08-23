import * as winston from "winston";

let logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json({
      replacer: null,
      space: "  "
    })
  ),
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "logs/error.log",
      handleExceptions: true
    }),
    new winston.transports.File({
      level: "info",
      filename: "logs/info.log",
      handleExceptions: true
    }),
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true
    })
  ],
  exitOnError: false
});

export default logger;
