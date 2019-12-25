interface INameToConfigMap {
  [configName: string]: Config
}

import Config from './Config'
import DefaultConfig from './DefaultConfig'
import GamesConfig from './GamesConfig'
import GuiConfig from './GuiConfig'
import TextsConfig from './TextsConfig'
const debug = require('debug')('yuki:configManager')

export default class ConfigManager {
  public static getInstance (): ConfigManager {
    if (!this.instance) {
      this.instance = new ConfigManager()
    }
    return this.instance
  }
  private static instance: ConfigManager | undefined

  public nameToConfigMap: INameToConfigMap = {
    default: new DefaultConfig().init(),
    games: new GamesConfig().init(),
    texts: new TextsConfig().init(),
    gui: new GuiConfig().init()
  }

  public get<T extends yuki.Config.Config> (configName: string): T {
    try {
      return this.nameToConfigMap[configName].get()
    } catch (e) {
      debug('no config named %s. return default', configName)
      return this.nameToConfigMap.default.get()
    }
  }

  public set<T extends yuki.Config.Config> (configName: string, cfg: T): void {
    try {
      return this.nameToConfigMap[configName].set(cfg)
    } catch (e) {
      debug('no config named %s', configName)
    }
  }

  public save (configName: string): void {
    try {
      return this.nameToConfigMap[configName].save()
    } catch (e) {
      debug('no config named %s', configName)
    }
  }

  public getFilename (configName: string): string {
    try {
      return this.nameToConfigMap[configName].getFilename()
    } catch (e) {
      debug('no config named %s', configName)
      return 'default'
    }
  }
}
