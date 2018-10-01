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
      localeEmulator: { name: "Locale Emulator", enabled: false, exec: "" },
      ntleas: { name: "Ntleas", enabled: false, exec: "" },
      noChanger: { name: "No Changer", enabled: true, exec: "%GAME_PATH%" }
    },
    onlineApis: [
      {
        name: "baidu",
        enabled: true,
        url: "https://fanyi.baidu.com/transapi",
        method: "POST",
        requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
        responseBodyPattern: "J%RESPONSE%.data[0].dst"
      },
      {
        name: "googleCN",
        enabled: true,
        url: "https://translate.google.cn/m",
        method: "POST",
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<'
      }
    ],
    translators: { jBeijing: { enabled: false, path: "" } }
  };

  private static defaultGamesConfig = { games: [] };

  private default: Config = new Config(
    "config/config.yml",
    ConfigManager.defaultDefaultConfig
  );
  private games: Config = new Config(
    "config/games.yml",
    ConfigManager.defaultGamesConfig
  );

  private nameToConfigMap: NameToConfigMap = {
    default: this.default,
    games: this.games
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
