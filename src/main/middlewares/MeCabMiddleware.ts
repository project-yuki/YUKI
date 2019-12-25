import * as fs from 'fs'
import * as path from 'path'
const debug = require('debug')('yuki:mecab')
const toHiragana = require('wanakana').toHiragana
const toRomaji = require('wanakana').toRomaji

interface IMeCab {
  parseSync: (text: string) => string[][]
}

export default class MecabMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  /**
   * Role type
   * See: https://answers.yahoo.com/question/index?qid=20110805070212AAdpWZf
   * See: https://gist.github.com/neubig/2555399
   */
  public static readonly KANJI_TO_ABBR_MAP = {
    人名: 'm', // name
    地名: 'mp', // place
    名詞: 'n', // noun
    数詞: 'num', // number
    代名詞: 'pn', // pronoun
    動詞: 'v', // verb
    形状詞: 'a', // http://d.hatena.ne.jp/taos/20090701/p1
    連体詞: 'adn', // adnominal, http://en.wiktionary.org/wiki/連体詞
    形容詞: 'adj', // adjective
    副詞: 'adv', // adverb
    助詞: 'p', // 動詞 = particle
    助動詞: 'aux', // 助動詞 = auxiliary verb
    接尾辞: 'suf', // suffix
    接頭辞: 'pref', // prefix
    感動詞: 'int', // interjection
    接続詞: 'conj', // conjunction
    補助記号: 'punct', // punctuation
    記号: 'w' // letters
    // ROLE_PHRASE: 'x'
  }

  public static readonly ABBR_TO_COLOR_MAP = {
    m: '#a7ffeb',
    mp: '#84ffff',
    n: '#80d8ff',
    num: '#b9f6ca',
    pn: '#d500f9',
    v: '#ff9e80',
    a: '#bbdefb',
    adn: '#e1bee7',
    adj: '#ce93d8',
    adv: '#e1bee7',
    p: '#ffeb3b',
    aux: '#fff176',
    suf: '#fdd835',
    pref: '#fbc02d',
    int: '#ffcdd2',
    conj: '#ff8a65',
    punct: '#d32f2f',
    w: '#bcaaa4'
  }

  public static isMeCabString (mstring: string): boolean {
    return mstring.startsWith('$')
  }

  public static stringToObject (mstring: string): yuki.MeCabPatterns {
    if (!this.isMeCabString(mstring)) return []

    const validString = mstring.substring(1)
    const result: yuki.MeCabPatterns = []
    validString.split('|').forEach((value) => {
      const aWord = value.split(',')
      result.push({ word: aWord[0], abbr: aWord[1], kana: aWord[2] })
    })
    return result
  }

  public static objectToOriginalText (patterns: yuki.MeCabPatterns): string {
    let result = ''
    for (const pattern of patterns) {
      result += pattern.word
    }
    return result
  }

  public static kanaToRomaji (kana: string): string {
    return toRomaji(kana)
  }

  private mecab: IMeCab | undefined

  constructor (config: yuki.Config.Libraries['mecab']) {
    if (
      !config.enable ||
      !fs.existsSync(path.join(config.path, 'libmecab.dll'))
    ) {
      debug('disabled')
      return
    }

    process.env.PATH += `;${config.path}`
    try {
      this.mecab = require('mecab-ffi')
      debug('enabled')
    } catch (e) {
      debug('enable failed !> %s', e)
    }
  }

  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    if (!this.mecab) {
      next(context)
      return
    }

    const results = this.mecab.parseSync(context.text)
    const usefulResult = []
    for (const result of results) {
      let kana = toHiragana(result[8])
      if (kana === result[0]) kana = ''
      usefulResult.push(
        `${result[0]},${MecabMiddleware.KANJI_TO_ABBR_MAP[result[1]]},${kana}`
      )
    }
    context.text = `$${usefulResult.join('|')}`
    next(context)
  }
}
