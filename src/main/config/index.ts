interface NameToConfigMap {
  [configName: string]: Config;
}

import Config from "./config";
import DefaultConfig from "./defaultConfig";
import GamesConfig from "./gamesConfig";
import InterceptorConfig from "./interceptorConfig";
import GuiConfig from "./guiConfig";
const debug = require("debug")("yagt:configManager");

export default class ConfigManager {
  static instance: ConfigManager;
  static getInstance(): ConfigManager {
    if (this.instance == null) {
      this.instance = new ConfigManager();
    }
    return this.instance;
  }

  private nameToConfigMap: NameToConfigMap = {
    default: new DefaultConfig(),
    games: new GamesConfig(),
    interceptor: new InterceptorConfig(),
    gui: new GuiConfig()
  };

  get<T extends Yagt.Config.Config>(configName: string): T {
    try {
      return this.nameToConfigMap[configName].get();
    } catch (e) {
      debug("no config named %s. return default", configName);
      return this.nameToConfigMap["default"].get();
    }
  }

  set<T extends Yagt.Config.Config>(configName: string, cfg: T): void {
    try {
      return this.nameToConfigMap[configName].set(cfg);
    } catch (e) {
      debug("no config named %s", configName);
    }
  }

  save(configName: string): void {
    try {
      return this.nameToConfigMap[configName].save();
    } catch (e) {
      debug("no config named %s", configName);
    }
  }

  getFilename(configName: string): string {
    try {
      return this.nameToConfigMap[configName].getFilename();
    } catch (e) {
      debug("no config named %s", configName);
      return "";
    }
  }
}
