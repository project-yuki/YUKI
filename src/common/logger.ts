import * as winston from "winston";
import * as stringify from "json-stringify-safe";

export default class Logger {
  private static simpleFormatWithJsObject = winston.format.printf(info => {
    return `${info.level.toUpperCase()} ${stringify(info.message, null, 2)}`;
  });

  private static logger: winston.Logger;

  /**
   * initialize new logger instance
   *
   * log level: 0-none, 1-error, 2-warn, 3-info, 4-debug
   * @param level log level
   */
  static initialize(level?: number) {
    if (this.logger) {
      this.logger.close();
      delete this.logger;
    }
    let transports: any[] = [
      new winston.transports.Console({
        level: "debug",
        handleExceptions: true
      })
    ];
    if (!level) level = 0;
    if (level > 0) {
      transports.push(
        new winston.transports.File({
          level: "error",
          filename: "log/error.log",
          handleExceptions: true
        })
      );
    }
    if (level > 1) {
      transports.push(
        new winston.transports.File({
          level: "warn",
          filename: "log/warn.log",
          handleExceptions: true
        })
      );
    }
    if (level > 2) {
      transports.push(
        new winston.transports.File({
          level: "info",
          filename: "log/info.log",
          handleExceptions: true
        })
      );
    }
    if (level > 3) {
      transports.push(
        new winston.transports.File({
          level: "debug",
          filename: "log/debug.log",
          handleExceptions: true
        })
      );
    }
    this.logger = winston.createLogger({
      format: winston.format.combine(Logger.simpleFormatWithJsObject),
      transports,
      exitOnError: false
    });
  }

  static debug(msg: any) {
    this.logger.debug(msg);
  }

  static info(msg: any) {
    this.logger.info(msg);
  }

  static warn(msg: any) {
    this.logger.warn(msg);
  }

  static error(msg: any) {
    this.logger.error(msg);
  }
}
