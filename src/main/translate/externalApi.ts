import * as request from "request-promise-native";
import * as vm from "vm";
import * as fs from "fs";
import * as path from "path";
const debug = require("debug")("yagt:api");

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
      debug("external file %s loaded", absolutePath);
    } catch (e) {
      debug("external file %s loads failed !> %s", absolutePath, e);
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
