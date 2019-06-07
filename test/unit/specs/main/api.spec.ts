import { expect } from 'chai'
import Api from '../../../../src/main/translate/Api'
import TranslationManager from '../../../../src/main/translate/translationManager'

describe('Api', () => {
  it('gets translation from form and parses with regex', (done) => {
    const googleCN = new Api({
      name: 'googleCN',
      url: 'https://translate.google.cn/m',
      method: 'POST',
      requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
      responseBodyPattern: 'Rclass="t0">([^<]*)<'
    })

    return googleCN.translate(
      '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
      (translation) => {
        try {
          expect(translation).to.equal(
            '如果你捕获Akira Makoto-kun，它将是210日元。我明白了......'
          )
        } catch (e) {
          return done(e)
        }
        done()
      }
    )
  }).timeout(5000)

  it('combines multiple translations into yuki.Translations object', (done) => {
    const apis = [
      {
        name: 'googleCN',
        url: 'https://translate.google.cn/m',
        method: 'POST',
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<',
        enable: true
      }
    ]

    TranslationManager.getInstance()
      .initializeApis(apis)
      .translateAll(
        '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
        (translations) => {
          try {
            expect(translations).to.deep.equal({
              original: '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
              translations: {
                googleCN:
                  '如果你捕获Akira Makoto-kun，它将是210日元。我明白了......'
              }
            })
          } catch (e) {
            return done(e)
          }
          done()
        }
      )
  }).timeout(5000)

  it('returns no translation if there is no enabled api', (done) => {
    const apis = [
      {
        name: 'baidu',
        url: 'https://fanyi.baidu.com/transapi',
        method: 'POST',
        requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
        responseBodyPattern: 'J%RESPONSE%.data[0].dst',
        enable: false
      },
      {
        name: 'googleCN',
        url: 'https://translate.google.cn/m',
        method: 'POST',
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<',
        enable: false
      }
    ]

    TranslationManager.getInstance()
      .initializeApis(apis)
      .translateAll(
        '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
        (translations) => {
          try {
            expect(translations).to.deep.equal({
              original: '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
              translations: {}
            })
          } catch (e) {
            return done(e)
          }
          done()
        }
      )
  })

  it('returns translations for any enabled apis', (done) => {
    const apis = [
      {
        name: 'googleCN',
        url: 'https://translate.google.cn/m',
        method: 'POST',
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<',
        enable: true
      }
    ]

    TranslationManager.getInstance()
      .initializeApis(apis)
      .translateAll(
        '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
        (translations) => {
          try {
            expect(translations).to.deep.equal({
              original: '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
              translations: {
                googleCN:
                  '如果你捕获Akira Makoto-kun，它将是210日元。我明白了......'
              }
            })
          } catch (e) {
            return done(e)
          }
          done()
        }
      )
  }).timeout(5000)
})
