import * as fs from "fs";
import * as path from "path";
const toHiragana = require("wanakana").toHiragana;

interface MeCab {
  parseSync: (text: string) => string[][];
}

export default class MecabMiddleware
  implements Yagt.Middleware<Yagt.TextOutputObject> {
  /**
   * Role type
   * See: https://answers.yahoo.com/question/index?qid=20110805070212AAdpWZf
   * See: https://gist.github.com/neubig/2555399
   */
  public static readonly KANJI_TO_ABBR_MAP = {
    人名: "m", // name
    地名: "mp", // place
    名詞: "n", // noun
    数詞: "num", // number
    代名詞: "pn", // pronoun
    動詞: "v", // verb
    形状詞: "a", // http://d.hatena.ne.jp/taos/20090701/p1
    連体詞: "adn", // adnominal, http://en.wiktionary.org/wiki/連体詞
    形容詞: "adj", // adjective
    副詞: "adv", // adverb
    助詞: "p", // 動詞 = particle
    助動詞: "aux", // 助動詞 = auxiliary verb
    接尾辞: "suf", // suffix
    接頭辞: "pref", // prefix
    感動詞: "int", // interjection
    接続詞: "conj", // conjunction
    補助記号: "punct", // punctuation
    記号: "w" // letters
    // ROLE_PHRASE: 'x'
  };

  public static isMeCabString(mstring: string): boolean {
    return mstring.startsWith("$");
  }

  public static stringToObject(mstring: string): Yagt.MeCabPatterns {
    if (!this.isMeCabString(mstring)) return [];

    let validString = mstring.substring(1);
    let result: Yagt.MeCabPatterns = [];
    validString.split("|").forEach(value => {
      let aWord = value.split(",");
      result.push({ word: aWord[0], abbr: aWord[1], kana: aWord[2] });
    });
    return result;
  }

  constructor(config: Yagt.Config.MeCab) {
    if (
      !config.enable ||
      !fs.existsSync(path.join(config.path, "libmecab.dll"))
    )
      return;

    process.env.PATH += `;${config.path}`;
    this.mecab = require("mecab-ffi");
  }

  private mecab: MeCab | undefined;

  process(
    context: Yagt.TextOutputObject,
    next: (newContext: Yagt.TextOutputObject) => void
  ) {
    if (!this.mecab) {
      next(context);
      return;
    }

    let result = this.mecab.parseSync(context.text);
    let usefulResult = [];
    for (const i in result) {
      let kana = toHiragana(result[i][8]);
      if (kana === result[i][0]) kana = "";
      usefulResult.push(
        `${result[i][0]},${
          MecabMiddleware.KANJI_TO_ABBR_MAP[result[i][1]]
        },${kana}`
      );
    }
    context.text = `$${usefulResult.join("|")}`;
    next(context);
  }
}
