import Api from "../translate/api";

export default class TranslationManager {
  static instance: TranslationManager = new TranslationManager();
  static getInstance(): TranslationManager {
    return this.instance;
  }

  apis: Yagt.Api[] = [];

  initialize(apis: Yagt.Config.OnlineApiItem[]): TranslationManager {
    for (let index in apis) {
      this.apis[apis[index].name] = new Api(apis[index]);
    }
    return this;
  }

  translate(text: string, callback: (translations: Yagt.Translations) => void) {
    let toTranslateCount = 0;
    let finishedCount = 0;
    let result: Yagt.Translations = {
      original: text,
      translations: {}
    };
    for (let key in this.apis) {
      if (this.apis[key].isEnabled()) {
        toTranslateCount++;
        this.apis[key].translate(text, translation => {
          result.translations[key] = translation;
          finishedCount++;
          if (finishedCount === toTranslateCount) {
            callback(result);
          }
        });
      }
    }
    if (toTranslateCount === 0) {
      callback(result);
    }
  }
}
