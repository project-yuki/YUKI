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
import DefaultConfig from "./defaultConfig";
import GamesConfig from "./gamesConfig";
import InterceptorConfig from "./interceptorConfig";
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
    interceptor: new InterceptorConfig()
  };

  get(configName: string): any {
    try {
      return this.nameToConfigMap[configName].get();
    } catch (e) {
      debug("no config named %s", configName);
      return null;
    }
  }

  set(configName: string, cfg: any) {
    try {
      return this.nameToConfigMap[configName].set(cfg);
    } catch (e) {
      debug("no config named %s", configName);
    }
  }

  save(configName: string) {
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
