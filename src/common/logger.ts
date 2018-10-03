import * as winston from "winston";
import * as stringify from "json-stringify-safe";

let simpleFormatWithJsObject = winston.format.printf(info => {
  return `${info.level.toUpperCase()} ${stringify(info.message, null, 2)}`;
});

let logger = winston.createLogger({
  format: winston.format.combine(simpleFormatWithJsObject),
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
    new winston.transports.File({
      level: "debug",
      filename: "logs/debug.log",
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
