const request = require("request-promise-native");
import { Options } from "request";
const debug = require("debug")("yagt:api");
import * as vm from "vm";

export default class Api implements Yagt.Translator {
  private config: Yagt.Config.OnlineApiItem;
  private requestOptions: Options;
  private responseVmContext: vm.Context = vm.createContext({
    response: "",
    result: ""
  });

  constructor(config: Yagt.Config.OnlineApiItem) {
    this.config = config;
    this.requestOptions = {
      url: this.config.url,
      method: this.config.method,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0"
      }
    };
  }

  async translate(text: string) {
    this.generateRequestBody(text);
    try {
      let responseBody = await this.getResponseBody();
      let translation = this.parseResponse(responseBody);
      return translation;
    } catch (e) {
      debug("[%s] translate error: %s", this.config.name, e);
      return "";
    }
  }

  private generateRequestBody(text: string) {
    let requestBodyString = this.config.requestBodyFormat.replace(
      "%TEXT%",
      `"${text}"`
    );
    if (this.config.requestBodyFormat.startsWith("X")) {
      this.requestOptions.form = JSON.parse(requestBodyString.substring(1));
    } else if (this.config.requestBodyFormat.startsWith("J")) {
      this.requestOptions.json = JSON.parse(requestBodyString.substring(1));
    } else {
      debug(
        "[%s] no such request body type: %s",
        this.config.name,
        this.config.requestBodyFormat.substring(0, 1)
      );
    }
  }

  private getResponseBody() {
    return request(this.requestOptions);
  }

  private parseResponse(body: string): string {
    if (this.config.responseBodyPattern.startsWith("J")) {
      return this.parseResponseByJsObject(body);
    } else if (this.config.responseBodyPattern.startsWith("R")) {
      return this.parseResponseByRegExp(body);
    } else {
      debug(
        "[%s] no such response parser type: %s",
        this.config.name,
        this.config.responseBodyPattern.substring(0, 1)
      );
      return "";
    }
  }

  private parseResponseByJsObject(body: string): string {
    this.responseVmContext.response = JSON.parse(body);
    let scriptString = this.config.responseBodyPattern
      .substring(1)
      .replace("%RESPONSE%", `result = response`);
    vm.runInNewContext(scriptString, this.responseVmContext);
    return this.responseVmContext.result;
  }

  private parseResponseByRegExp(body: string) {
    let pattern = new RegExp(this.config.responseBodyPattern.substring(1));
    let response = pattern.exec(body);
    if (response) {
      return response[1];
    } else {
      return "";
    }
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
