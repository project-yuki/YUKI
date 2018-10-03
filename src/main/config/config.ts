import * as fs from "fs";
import * as jsonfile from "jsonfile";
import logger from "../../common/logger";

export default class Config {
  private filename: string;
  private config: any;

  constructor(filename: string, defaultObject?: any) {
    this.filename = filename;
    if (!fs.existsSync(`${filename}.json`)) {
      this.checkAndSaveDefault(defaultObject);
    } else {
      this.load();
    }
  }

  private checkAndSaveDefault(defaultObject: any) {
    this.config = defaultObject;
    this.save();
  }

  load() {
    try {
      this.loadAndThrow();
    } catch (e) {
      logger.error(`config: file ${this.filename} loads failed with`);
      logger.error(e);
    }
  }

  private loadAndThrow() {
    this.config = jsonfile.readFileSync(`${this.filename}.json`);
    logger.debug(`config: ${this.filename} loaded with`);
    logger.debug(this.config);
  }

  save() {
    try {
      this.saveAndThrow();
    } catch (e) {
      logger.error(`config: file ${this.filename} saves failed with`);
      logger.error(e);
    }
  }

  private saveAndThrow() {
    jsonfile.writeFileSync(`${this.filename}.json`, this.config, {
      spaces: 2,
      EOL: "\r\n"
    });
    logger.debug(`config: ${this.filename} saved with`);
    logger.debug(this.config);
  }

  get() {
    return this.config;
  }

  set(cfg: any) {
    this.config = cfg;
    this.save();
  }

  getFileName() {
    return this.filename;
  }
}
