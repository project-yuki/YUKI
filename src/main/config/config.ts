import * as fs from "fs";
import * as jsonfile from "jsonfile";
import logger from "../../common/logger";

abstract class Config {
  protected config: any;

  protected abstract getDefaultObject(): object;
  public abstract getFilename(): string;

  constructor() {
    if (!fs.existsSync(`config/${this.getFilename()}.json`)) {
      this.config = this.getDefaultObject();
      this.save();
    } else {
      this.load();
    }
  }

  load() {
    try {
      this.config = jsonfile.readFileSync(`config/${this.getFilename()}.json`);
      logger.debug(`config: ${this.getFilename()} loaded with`);
      logger.debug(this.config);
    } catch (e) {
      logger.error(`config: file ${this.getFilename()} loads failed with`);
      logger.error(e);
    }
  }

  save() {
    try {
      jsonfile.writeFileSync(
        `config/${this.getFilename()}.json`,
        this.config,
        this.getFileOptions()
      );
      logger.debug(`config: ${this.getFilename()} saved with`);
      logger.debug(this.config);
    } catch (e) {
      logger.error(`config: file ${this.getFilename()} saves failed with`);
      logger.error(e);
    }
  }

  private getFileOptions() {
    return {
      spaces: 2,
      EOL: "\r\n"
    };
  }

  get() {
    return this.config;
  }

  set(cfg: any) {
    this.config = cfg;
    this.save();
  }
}

export default Config;
