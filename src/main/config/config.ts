import * as fs from "fs";
import * as yaml from "js-yaml";
import logger from "../logger";

export default class Config {
  private filename: string;
  private config: any;

  constructor(filename: string, defaultObject?: any) {
    this.filename = filename;
    if (!fs.existsSync(filename)) {
      this.checkAndSaveDefault(defaultObject);
    } else {
      this.load();
    }
  }

  private checkAndSaveDefault(defaultObject: any) {
    this.checkAndMakeConfigFolder();
    this.config = defaultObject;
    this.save();
  }

  private checkAndMakeConfigFolder() {
    if (!fs.existsSync("config")) {
      fs.mkdirSync("config");
      logger.debug("created ./config folder");
    }
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
    this.config = yaml.safeLoad(fs.readFileSync(this.filename, "utf8"));
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
    fs.writeFileSync(this.filename, yaml.safeDump(this.config), "utf8");
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
