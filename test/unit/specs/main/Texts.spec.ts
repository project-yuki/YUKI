// tslint:disable-next-line: no-reference
/// <reference path="../../../../src/types/common.d.ts" />

import { expect } from 'chai'
import TextModifierMiddleware from '../../../../src/main/middlewares/TextModifierMiddleware'

describe('Texts', () => {
  it('removes ascii characters when .removeAscii = true', (done) => {
    const textModifierMiddleware = new TextModifierMiddleware({
      removeAscii: true
    })

    textModifierMiddleware.process(
      { text: 'ボクにaa選択のbb余地はcc無かった。' },
      (newContext) => {
        try {
          expect(newContext.text).to.deep.equal('ボクに選択の余地は無かった。')
        } catch (e) {
          return done(e)
        }
        done()
      }
    )
  })

  it('removes duplicate characters when .deduplicate = true', (done) => {
    const textModifierMiddleware = new TextModifierMiddleware({
      deduplicate: true
    })

    textModifierMiddleware.process(
      { text: 'ボクに選択選択の余地はは無かった無かった。' },
      (newContext) => {
        try {
          expect(newContext.text).to.deep.equal('ボクに選択の余地は無かった。')
        } catch (e) {
          return done(e)
        }
        done()
      }
    )
  })
})
