const request = require("request");
import * as vm from "vm";
import * as fs from "fs";
import * as path from "path";
import logger from "../../common/logger";

export default class ExternalApi implements Yagt.Translator {
  private config: Yagt.Config.OnlineApiItem;
  private responseVmContext: vm.Context = vm.createContext({
    Request: request,
    text: "",
    result: ""
  });
  private scriptString: string = "";

  constructor(config: Yagt.Config.OnlineApiItem) {
    this.config = config;
    this.loadExternalJsFile();
  }

  loadExternalJsFile() {
    let absolutePath = path.join(global.__baseDir, this.config.jsFile);
    try {
      this.scriptString = fs.readFileSync(absolutePath, "utf8");
      logger.debug(`api: external file ${absolutePath} loaded`);
    } catch (e) {
      logger.error(`api: external file ${absolutePath} loads failed with`);
      logger.error(e);
    }
  }

  async translate(text: string) {
    this.responseVmContext.text = text;
    return new Promise<string>(resolve => {
      vm.runInNewContext(this.scriptString, this.responseVmContext);
      resolve(this.responseVmContext.result);
    });
  }

  isEnable() {
    return this.config.enable;
  }

  setEnable(isEnable: boolean) {
    this.config.enable = isEnable;
  }

  getName() {
    return this.config.name;
  }
}
