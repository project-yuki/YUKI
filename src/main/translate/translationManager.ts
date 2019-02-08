import Api from "../translate/api";
import JBeijingAdapter from "./jbeijing";
const debug = require("debug")("yagt:translationManager");
import ExternalApi from "./externalApi";

export default class TranslationManager {
  private static instance: TranslationManager;
  static getInstance(): TranslationManager {
    if (this.instance == null) {
      this.instance = new TranslationManager();
    }
    return this.instance;
  }

  private apis: Yagt.Translator[] = [];

  initializeApis(apis: Yagt.Config.Default["onlineApis"]): TranslationManager {
    for (let index in apis) {
      if (apis[index].external && apis[index].jsFile) {
        this.apis[apis[index].name] = new ExternalApi(apis[index]);
      } else {
        this.apis[apis[index].name] = new Api(apis[index]);
      }
    }
    return this;
  }

  initializeTranslators(translators: Yagt.Config.Default["translators"]) {
    if (translators.jBeijing) {
      let jb = new JBeijingAdapter(translators.jBeijing);
      this.apis[jb.getName()] = jb;
    }
  }

  translate(
    text: string,
    callback: (translation: Yagt.Translations["translations"]) => void
  ) {
    let toTranslateCount = 0;
    for (let key in this.apis) {
      if (this.apis[key].isEnable()) {
        toTranslateCount++;
        (async () => {
          let translation = await this.apis[key].translate(text);
          debug("[%s] -> %s", this.apis[key].getName(), translation);
          callback({
            [this.apis[key].getName()]: translation
          });
        })();
      }
    }
    if (toTranslateCount === 0) {
      callback({});
    }
  }

  translateAll(
    text: string,
    callback: (translations: Yagt.Translations) => void
  ) {
    let toTranslateCount = 0;
    let finishedCount = 0;
    let result: Yagt.Translations = { original: text, translations: {} };
    for (let key in this.apis) {
      if (this.apis[key].isEnable()) {
        toTranslateCount++;
        (async () => {
          result.translations[key] = await this.apis[key].translate(text);
          finishedCount++;
          if (finishedCount === toTranslateCount) {
            callback(result);
          }
        })();
      }
    }
    if (toTranslateCount === 0) {
      callback(result);
    }
  }
}
