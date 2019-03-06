import * as fs from "fs";
import * as jsonfile from "jsonfile";
const debug = require("debug")("yagt:config");

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
      debug("%s loaded", `config/${this.getFilename()}.json`);
    } catch (e) {
      debug("%s loads failed !> %s", `config/${this.getFilename()}.json`, e);
    }
  }

  save() {
    try {
      jsonfile.writeFileSync(
        `config/${this.getFilename()}.json`,
        this.config,
        Config.FILE_OPTIONS
      );
      debug("%s saved", `config/${this.getFilename()}.json`);
    } catch (e) {
      debug("%s saves failed !> %s", `config/${this.getFilename()}.json`, e);
    }
  }

  private static readonly FILE_OPTIONS = {
    spaces: 2,
    EOL: "\r\n"
  };

  get() {
    return this.config;
  }

  set(cfg: any) {
    this.config = cfg;
    this.save();
  }
}

export default Config;
