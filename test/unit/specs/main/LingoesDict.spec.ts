// tslint:disable-next-line: no-reference
/// <reference path="../../../../src/types/config.d.ts" />

import { expect } from 'chai'
import * as path from 'path'
import LingoesDict from '../../../../src/main/translate/LingoesDict'

describe('LingoesDict', () => {
  it('returns correct result if found', (done) => {
    const lingoes = new LingoesDict({
      enable: true,
      path: path.resolve(__dirname, '../../../../../libraries/dict/lingoes/njcd.db')
    })

    lingoes.find('かわいい', (result) => {
      // tslint:disable-next-line: no-console
      console.log(result)
      try {
        expect(result).to.deep.equal({
          found: true,
          word: 'かわいい',
          content: '<C><F><H /><I><N><P><U>形</U></P><Q>可愛い</Q><Q>可爱。' +
                   '<T><W>かわいい女の子</W><X>可爱的小女孩儿。</X></T></Q><Q>小' +
                   '巧玲珑。<T><h><W>かわいい子には旅をさせよ</W><X>不可娇生惯养。<' +
                   '/X></h></T></Q><Q>かわいいさ，かわいいげ</Q></N></I></F></C>'
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
      // tslint:disable-next-line: no-console
      console.log(result)
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
