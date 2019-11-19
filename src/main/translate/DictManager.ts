import ConfigManager from '../config/ConfigManager'
import LingoesDict from './LingoesDict'

export default class DictManager {
  public static init (config: yuki.Config.Dictionaries) {
    this.lingoes = new LingoesDict(config.lingoes)
  }

  public static find (options: yuki.DictOptions, callback: (result: yuki.DictResult) => void) {
    if (options.dict !== 'lingoes') callback({ found: false })

    this.lingoes.find(options.word, callback)
  }
  private static lingoes: LingoesDict
}
