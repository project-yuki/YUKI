// tslint:disable-next-line: no-reference
/// <reference path="../../../../src/types/config.d.ts" />

import { expect } from 'chai'
import * as path from 'path'
import * as util from 'util'
import LingoesDict from '../../../../src/main/translate/LingoesDict'

describe('LingoesDict', () => {
  it('returns correct pattern if found', (done) => {
    const lingoes = new LingoesDict({
      enable: true,
      path: path.resolve(__dirname, '../../../../../libraries/dict/lingoes/njcd.db')
    })

    lingoes.find('1', (result) => {
      try {
        expect(result).to.deep.equal(JSON.parse('{"found":true,"word":"1","content":{"kana":["' +
        'イチ·イツ","ひと·ひとつ·ひ"],"definitions":[{"partOfSpeech":"(H10","explanation' +
        's":[{"content":"一，第一。","example":{"sentence":"一月(いちがつ)·一番(いちばん)·一' +
        '姫二太郎(いちひめにたろう)。","content":""}},{"content":"一个。","example":{"sente' +
        'nce":"一々(いちいち)·一因(いちいん)·一個(いっこ)·一民間会社(いちみんかんがいしゃ)。","con' +
        'tent":""}},{"content":"一次。","example":{"sentence":"一敗(いっぱい)·一面識(いちめ' +
        'んしき)。","content":""}},{"content":"最优秀，最好，第一。","example":{"sentence":"' +
        '一流(いちりゅう)·一位(いちい)。","content":""}},{"content":"表示全体，都。","example"' +
        ':{"sentence":"一切(いっさい)·一族(いちぞく)·一座(いちざ)。","content":""}},{"content"' +
        ':"某，另外的，别的。","example":{"sentence":"一夜(いちや)·一説(いっせつ)·一書(いっしょ)。' +
        '","content":""}},{"content":"普通的。","example":{"sentence":"一介(いっかい)·一教' +
        '師(いちきょうし)·一読者(いちどくしゃ)。","content":""}},{"content":"相同，同样(合为一体)' +
        '。","example":{"sentence":"一概(いちがい)·一咽(いちよう)·同一(どういつ)·画一(かくいつ)。' +
        '","content":""}},{"content":"专一，一心。","example":{"sentence":"一念(いちねん)·' +
        '一途(いちず)·純一(じゅんいつ)·一意專心(いちいせんしん)。","content":""}},{"content":")仅，' +
        '只，一点儿。","example":{"sentence":"一寸(ちょっと·いっすん)·一瞬(いっしゅん)·一言(いちご' +
        'ん)。","content":""}}]},{"partOfSpeech":"(H11","explanations":[{"content":")或。"' +
        ',"example":{"sentence":"一喜一憂(いっきいちゆう)·一得一失(いっとくいっしつ)。","content":' +
        '""}}]},{"partOfSpeech":"(H12","explanations":[{"content":")用于强调或调整语气(带有不' +
        '容忽视之意)。","example":{"sentence":"一見識(いっけんしき·いちけんしき)·一考察(いちこうさ' +
        'つ)。","content":""}}]}]}}'))
        lingoes.close()
        done()
      } catch (e) {
        lingoes.close()
        return done(e)
      }
    })
  })

  it('returns correct pattern if found - 2', (done) => {
    const lingoes = new LingoesDict({
      enable: true,
      path: path.resolve(__dirname, '../../../../../libraries/dict/lingoes/njcd.db')
    })

    lingoes.find('ゲーム', (result) => {
      try {
        expect(result).to.deep.equal({
          found: true,
          word: 'ゲーム',
          content: {
            definitions: [
              {
                partOfSpeech: undefined,
                explanations: [
                  {
                    content: 'game游戏。比赛。',
                    example: { sentence: '', content: '' }
                  }
                ]
              }
            ]
          }
        })
        lingoes.close()
        done()
      } catch (e) {
        lingoes.close()
        return done(e)
      }
    })
  })

  it('returns notfound if so', (done) => {
    const lingoes = new LingoesDict({
      enable: true,
      path: path.resolve(__dirname, '../../../../../libraries/dict/lingoes/njcd.db')
    })

    lingoes.find('キミ', (result) => {
      try {
        expect(result).to.deep.equal({
          found: false
        })
        lingoes.close()
        done()
      } catch (e) {
        lingoes.close()
        return done(e)
      }
    })
  })
})
