namespace Yagt {
  export interface Configs {
    default: Config;
    games: Config;
  }
}

interface NameToConfigMap {
  [configName: string]: Config;
}

import Config from "./config";
import logger from "../../common/logger";

export default class ConfigManager {
  static instance: ConfigManager;
  static getInstance(): ConfigManager {
    if (this.instance == null) {
      this.instance = new ConfigManager();
    }
    return this.instance;
  }

  private static defaultDefaultConfig = {
    localeChangers: {
      localeEmulator: { name: "Locale Emulator", enable: false, exec: "" },
      ntleas: { name: "Ntleas", enable: false, exec: "" },
      noChanger: { name: "No Changer", enable: true, exec: "%GAME_PATH%" }
    },
    onlineApis: [
      {
        name: "baidu",
        enable: true,
        url: "https://fanyi.baidu.com/transapi",
        method: "POST",
        requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
        responseBodyPattern: "J%RESPONSE%.data[0].dst"
      },
      {
        name: "googleCN",
        enable: true,
        url: "https://translate.google.cn/m",
        method: "POST",
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<'
      }
    ],
    translators: { jBeijing: { enable: false, path: "" } }
  };

  private static defaultGamesConfig = { games: [] };

  private static defaultInterceptorConfig = {
    shouldBeIgnore: [],
    shouldBeRemove: []
  };

  private nameToConfigMap: NameToConfigMap = {
    default: new Config("config/config", ConfigManager.defaultDefaultConfig),
    games: new Config("config/games", ConfigManager.defaultGamesConfig),
    interceptor: new Config(
      "config/interceptor",
      ConfigManager.defaultInterceptorConfig
    )
  };

  get(configName: string): any {
    try {
      console.log(this.nameToConfigMap[configName]);
      return this.nameToConfigMap[configName].get();
    } catch (e) {
      logger.error(`config manager: no config named ${configName}`);
      return null;
    }
  }

  set(configName: string, cfg: any) {
    try {
      return this.nameToConfigMap[configName].set(cfg);
    } catch (e) {
      logger.error(`config manager: no config named ${configName}`);
    }
  }

  save(configName: string) {
    try {
      return this.nameToConfigMap[configName].save();
    } catch (e) {
      logger.error(`config manager: no config named ${configName}`);
    }
  }

  getFileName(configName: string): string {
    try {
      return this.nameToConfigMap[configName].getFileName();
    } catch (e) {
      logger.error(`config manager: no config named ${configName}`);
      return "";
    }
  }
}
