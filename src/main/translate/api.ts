const request = require("request");
import { Options, Response } from "request";
import logger from "../../common/logger";
import * as vm from "vm";

export default class Api implements Yagt.Translator {
  private config: Yagt.Config.OnlineApiItem;
  private requestOptions: Options = {
    url: this.config.url,
    method: this.config.method,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0"
    }
  };

  constructor(config: Yagt.Config.OnlineApiItem) {
    this.config = config;
  }

  async translate(text: string) {
    this.generateRequestBody(text);
    try {
      let responseBody = await this.getResponseBody();
      let translation = this.parseResponse(responseBody);
      return translation;
    } catch (e) {
      return "";
    }
  }

  private generateRequestBody(text: string) {
    let requestBodyString = this.config.requestBodyFormat.replace(
      "%TEXT%",
      `"${text.trim()}"`
    );
    if (this.config.requestBodyFormat.startsWith("X")) {
      this.requestOptions.form = JSON.parse(requestBodyString.substring(1));
    } else if (this.config.requestBodyFormat.startsWith("J")) {
      this.requestOptions.json = JSON.parse(requestBodyString.substring(1));
    } else {
      logger.error(`API [${this.config.name}]: No such request body type`);
    }
  }

  private getResponseBody() {
    return new Promise<string>((resolve, reject) => {
      request(
        this.requestOptions,
        (error: any, response: Response, body: string) => {
          if (error || response.statusCode != 200) {
            logger.error(
              `API [${this.config.name}]: ${response.statusCode} ${error}`
            );
            reject();
          }
          resolve(body);
        }
      );
    });
  }

  private parseResponse(body: string): string {
    if (this.config.responseBodyPattern.startsWith("J")) {
      return this.parseResponseByJsObject(body);
    } else if (this.config.responseBodyPattern.startsWith("R")) {
      return this.parseResponseByRegExp(body);
    } else {
      logger.error(`API [${this.config.name}]: No such response parser type`);
      return "";
    }
  }

  private parseResponseByJsObject(body: string): string {
    global.tempTranslationPattern[this.getName()] = JSON.parse(body);
    let toEval = this.config.responseBodyPattern
      .substring(1)
      .replace(
        "%RESPONSE%",
        `global.tempTranslationPattern["${this.getName()}"]`
      );
    let result = eval(toEval);
    delete global.tempTranslationPattern[this.getName()];
    return result;
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
