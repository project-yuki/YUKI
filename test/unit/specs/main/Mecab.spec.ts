// tslint:disable-next-line: no-reference
/// <reference path="../../../../src/types/common.d.ts" />

import { expect } from 'chai'
import * as path from 'path'
import MecabMiddleware from '../../../../src/main/middlewares/MeCabMiddleware'

describe('MeCab', () => {
  it('returns correct patterns', (done) => {
    const mecabMiddleware = new MecabMiddleware({
      enable: true,
      path: path.resolve(__dirname, '../../../../../libraries/pos/mecab-ipadic')
    })

    mecabMiddleware.process(
      { text: 'ボクに選択の余地は無かった。' },
      (newContext) => {
        try {
          expect(newContext.text).to.deep.equal(
            '$ボク,n,ぼく|に,p,|選択,n,せんたく|の,p,|余地,n,よち|は,p,|無かっ,adj,なかっ|た,aux,|。,w,'
          )
        } catch (e) {
          return done(e)
        }
        done()
      }
    )
  })

  it('converts mecab string to object', () => {
    expect(
      MecabMiddleware.stringToObject(
        '$ボク,n,ぼく|に,p,|選択,n,せんたく|の,p,|余地,n,よち|は,p,|無かっ,adj,なかっ|た,aux,|。,w,'
      )
    ).to.deep.equal([
      { word: 'ボク', abbr: 'n', kana: 'ぼく' },
      { word: 'に', abbr: 'p', kana: '' },
      { word: '選択', abbr: 'n', kana: 'せんたく' },
      { word: 'の', abbr: 'p', kana: '' },
      { word: '余地', abbr: 'n', kana: 'よち' },
      { word: 'は', abbr: 'p', kana: '' },
      { word: '無かっ', abbr: 'adj', kana: 'なかっ' },
      { word: 'た', abbr: 'aux', kana: '' },
      { word: '。', abbr: 'w', kana: '' }
    ])

    expect(
      MecabMiddleware.stringToObject('ボクに選択の余地は無かった。')
    ).to.deep.equal([])
  })

  it('merges letter(w) patterns', (done) => {
    const mecabMiddleware = new MecabMiddleware({
      enable: true,
      path: path.resolve(__dirname, '../../../../../libraries/pos/mecab-ipadic')
    })

    mecabMiddleware.process(
      { text: 'ボクに選択の余地、無かった。。。！' },
      (newContext) => {
        try {
          expect(newContext.text).to.deep.equal(
            '$ボク,n,ぼく|に,p,|選択,n,せんたく|の,p,|余地,n,よち|、,w,|無かっ,adj,なかっ|た,aux,|。。。！,w,'
          )
        } catch (e) {
          return done(e)
        }
        done()
      }
    )
  })
})
