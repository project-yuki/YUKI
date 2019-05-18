import Api from './Api'
import JBeijingAdapter from './JBeijingAdapter'
const debug = require('debug')('yuki:translationManager')
import ExternalApi from './ExternalApi'

export default class TranslationManager {
  public static getInstance (): TranslationManager {
    if (!this.instance) {
      this.instance = new TranslationManager()
    }
    return this.instance
  }
  private static instance: TranslationManager | undefined

  private apis: yuki.Translator[] = []

  public initializeApis (
    apis: yuki.Config.Default['onlineApis']
  ): TranslationManager {
    for (const api of apis) {
      try {
        if (api.external && api.jsFile) {
          this.apis[api.name] = new ExternalApi(api)
        } else {
          this.apis[api.name] = new Api(api)
        }
      } catch (e) {
        continue
      }
    }
    return this
  }

  public initializeTranslators (
    translators: yuki.Config.Default['translators']
  ) {
    if (translators.jBeijing && translators.jBeijing.enable) {
      const jb = new JBeijingAdapter(translators.jBeijing)
      this.apis[jb.getName()] = jb
    }
  }

  public translate (
    text: string,
    callback: (translation: yuki.Translations['translations']) => void
  ) {
    let toTranslateCount = 0
    for (const key in this.apis) {
      if (this.apis[key].isEnable()) {
        toTranslateCount++;
        (async () => {
          const translation = await this.apis[key].translate(text)
          debug('[%s] -> %s', this.apis[key].getName(), translation)
          callback({
            [this.apis[key].getName()]: translation
          })
        })()
      }
    }
    if (toTranslateCount === 0) {
      callback({})
    }
  }

  public translateAll (
    text: string,
    callback: (translations: yuki.Translations) => void
  ) {
    let toTranslateCount = 0
    let finishedCount = 0
    const result: yuki.Translations = { original: text, translations: {} }
    for (const key in this.apis) {
      if (this.apis[key].isEnable()) {
        toTranslateCount++;
        (async () => {
          result.translations[key] = await this.apis[key].translate(text)
          finishedCount++
          if (finishedCount === toTranslateCount) {
            callback(result)
          }
        })()
      }
    }
    if (toTranslateCount === 0) {
      callback(result)
    }
  }
}
